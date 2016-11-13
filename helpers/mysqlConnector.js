/**
 * Created by Arman on 15/2/2016.
 */
'use strict';


var globals = require('./globals');
var Sequelize = require('sequelize');

module.exports.connect = function (config) {
  globals.sequelize = new Sequelize(config.database, config.user, config.password, {
      host: config.host,
      dialect: config.driver,

      pool: {
          max: 5,
          min: 0,
          idle: 10000
      }
  });

  globals
      .sequelize
      .authenticate()
      .then(function (err) {
          console.log('Database Connection has been established successfully.');
      })
      .catch(function (err) {
         console.log('Unable to connect to the database: ', err);
      });
    
  return globals.sequelize;
    
};