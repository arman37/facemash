/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';

const globals = require('../helpers/globals');
const images = globals.importModel('Images');
const battles = globals.importModel('Battles');
const sequelize = require('sequelize');
const arrayWrap = require('arraywrap');

let expectedScore = (Rb, Ra) => {
  return parseFloat((1 / (1 + Math.pow(10, (Rb - Ra) / 400))).toFixed(4));
};

let winnerScore = (score, expected) => {
  return score + 24 * (1 - expected);
};

let loserScore = (score, expected) => {
  return score + 24 * (0 - expected);
};

module.exports = {
    renderIndexPage: (config) => {
      let randomImages;

      images
        .findAll({
            limit: 2,
            order: [
                sequelize.fn('RAND')
            ]
        })
        .then((images) => {
          randomImages = images;

          return globals.sequelize.query('SELECT * FROM images ORDER BY ROUND(score/(1+(losses/wins))) DESC LIMIT 0,10');
        })
        .then((topRatings) => {
          config.success.call(this, {
            images: randomImages,
            expected: expectedScore,
            topRatings: topRatings[0]
          });
        })
        .catch((err) => {
          config.error.call(this, err);
        });
    },

    rateImages: (config) => {
      let winnerID = arrayWrap(config.params.query.winner || '')[0];
      let loserID = arrayWrap(config.params.query.loser || '')[0];

      if (winnerID && loserID) {
        let winner, loser;

        images
          .find({
            where: {
              image_id: winnerID
            }
          })
          .then((image) => {
            winner = image;

            return (
              images.find({
                where: {
                  image_id: loserID
                }
              })
            );
          })
          .then((image) => {
            loser = image;
            let winnerExpected = expectedScore(loser.score, winner.score);
            let winnerNewScore = winnerScore(winner.score, winnerExpected);

            return (
              images.update({
                score: winnerNewScore,
                wins: winner.wins + 1
              }, {
                where: {
                  image_id: winnerID
                }
              })
            );
          })
          .then(() => {
              let loserExpected = expectedScore(winner.score, loser.score);
              let loserNewScore = loserScore(loser.score, loserExpected);

              return (
                images.update({
                  score: loserNewScore,
                  losses: loser.losses + 1
                }, {
                  where: {
                    image_id: loserID
                  }
                })
              );
          })
          .then(() => {
            return (
              battles
                .build({ winner: winnerID, loser: loserID })
                .save()
            );
          })
          .then(() => {
            config.success.call(this);
          })
          .catch((err) => {
            config.error.call(this, err);
          });
      } else {
        config.error.call(this, null, 'client');
      }
    }

};