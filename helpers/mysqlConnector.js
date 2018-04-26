/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';


const globals = require('./globals');
const Sequelize = require('sequelize');

module.exports.connect = (config) => {
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
      .then((err) => {
          console.log('Database Connection has been established successfully.');
      })
      .catch((err) => {
         console.log('Unable to connect to the database: ', err);
      });
    
  return globals.sequelize;
};