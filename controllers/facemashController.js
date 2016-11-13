/**
 * Created by Arman on 15/2/2016.
 */
'use strict';

var globals = require('../helpers/globals');
var facemashService = globals.importService('facemash');


module.exports.controller = function (app) {
    app
        .get('/', function (req, res, next) {
            facemashService.renderIndexPage({
                params: req,
                success: function (obj) {
                    res.render('index', obj);
                },
                error: function (err, type) {
                    console.error('Error occurred:', err);
                    type == 'client' ? res.renderClientError() : res.renderServerError();
                }
            });
        })
        .post('/rate', function (req, res, next) {
            facemashService.rateImages({
                params: req,
                success: function (obj) {
                    res.redirect('/');
                },
                error: function (err, type) {
                    type == 'client' ? res.renderClientError() : res.renderServerError();
                }
            });
        });
};