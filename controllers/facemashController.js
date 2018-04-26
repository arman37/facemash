/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';

const globals = require('../helpers/globals');
const facemashService = globals.importService('facemash');


module.exports.controller = (app) => {
  app
    .get('/', (req, res, next) => {
      facemashService.renderIndexPage({
        params: req,
        success: (obj) => {
          res.render('index', obj);
        },
        error: (err, type) => {
          console.error('Error occurred:', err);
          type == 'client' ? res.renderClientError() : res.renderServerError();
        }
      });
    })
    .post('/rate', (req, res, next) => {
      facemashService.rateImages({
        params: req,
        success: (obj) => {
          res.redirect('/');
        },
        error: (err, type) => {
          type == 'client' ? res.renderClientError() : res.renderServerError();
        }
      });
    });
};