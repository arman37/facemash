'use strict'

var globals = require('../helpers/globals')
    ,Images = globals.importModel('Images')
    ,Battles = globals.importModel('Battles')
    ,Sequelize = require('sequelize')
    ,arrayWrap = require('arraywrap');

var expectedScore = function (Rb, Ra) {
    return parseFloat((1 / (1 + Math.pow(10, (Rb - Ra) / 400))).toFixed(4));
};

var winnerScore = function (score, expected) {
    return score + 24 * (1 - expected);
};

var loserScore = function (score, expected) {
  return score + 24 * (0 - expected);
};

module.exports = {
    renderIndexPage: function (config) {
        var randomImages;
        Images
            .findAll({
                limit: 2,
                order: [
                    Sequelize.fn('RAND')
                ]
            })
            .then(function (images) {
                randomImages = images;
                return globals.sequelize.query('SELECT * FROM images ORDER BY ROUND(score/(1+(losses/wins))) DESC LIMIT 0,10');
            })
            .then(function (topRatings) {
                config.success.call(this, {
                    images: randomImages,
                    expected: expectedScore,
                    topRatings: topRatings[0]
                });
            })
            .catch(function (err) {
                config.error.call(this, err);
            });
    },

    rateImages: function (config) {
        var winnerID = arrayWrap(config.params.query.winner || '')[0];
        var loserID = arrayWrap(config.params.query.loser || '')[0];
        if(winnerID && loserID) {
            var winner, loser;
            Images
                .find({
                    where: {
                        image_id: winnerID
                    }
                })
                .then(function (image) {
                    winner = image;
                    return Images.find({
                        where: {
                            image_id: loserID
                        }
                    })
                })
                .then(function (image) {
                    loser = image;
                    var winnerExpected = expectedScore(loser.score, winner.score);
                    var winnerNewScore = winnerScore(winner.score, winnerExpected);
                    return Images.update({
                        score: winnerNewScore,
                        wins: winner.wins + 1
                    }, {
                        where: {
                            image_id: winnerID
                        }
                    });
                })
                .then(function () {
                    var loserExpected = expectedScore(winner.score, loser.score);
                    var loserNewScore = loserScore(loser.score, loserExpected);
                    return Images.update({
                        score: loserNewScore,
                        losses: loser.losses + 1
                    }, {
                        where: {
                            image_id: loserID
                        }
                    });
                })
                .then(function () {
                    return Battles.build({winner: winnerID, loser: loserID}).save();
                })
                .then(function () {
                    config.success.call(this);
                })
                .catch(function (err) {
                    config.error.call(this, err);
                });
        }else {
            config.error.call(this, null, 'client');
        }
    }

};