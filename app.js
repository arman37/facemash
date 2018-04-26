/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dbConnector = require('./helpers/mysqlConnector');
const responseModifier = require('./middlewares/responseModifier');
let config = require('./config');


const app = express();
const env = app.get('env');

config = config(env);
dbConnector.connect(config.mysql);

require('./helpers/bootstrap')
  .initApp(
    app
    .set('views', path.resolve(__dirname, 'views'))
    .set('view engine', 'ejs')
    .use(logger('combined'))
    .use(bodyParser.urlencoded({extended: false}))
    .use(responseModifier), express)
  .then(() => {
    console.info('Server started at localhost:3000');
  })
  .catch((err) => {
    console.error('Oops!!! Something went wrong when initializing the app!');
  });

module.exports = app;