/**
 * Created by Arman on 15/2/2016.
 */
'use strict';

var express = require('express')
    ,path = require('path')
    ,logger = require('morgan')
    ,bodyParser = require('body-parser')
    ,mysqlConnector = require('./helpers/mysqlConnector')
    ,responseModifier = require('./middlewares/responseModifier')
    ,config = require('./config');


var app = express();
var env = app.get('env') == 'development' ? 'local' : app.get('env');

config = config(env);
mysqlConnector.connect(config.mysql);

require('./helpers/bootstrap').initApp(
    app
    .set('views', path.resolve(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(logger('combined'))
    .use(bodyParser.urlencoded({extended: false}))
    .use(responseModifier), express);

module.exports = app;