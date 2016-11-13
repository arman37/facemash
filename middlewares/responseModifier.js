/**
 * Created by Arman on 15/2/2016.
 */
'use strict';

module.exports = function (req, res, next) {
    res.renderServerError = function () {
        this
            .status(500)
            .send('Oops! Internal server Error.');
    };
    res.renderClientError = function () {
        this.render('404');
    };
    next();
};