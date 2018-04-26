/**
 *
 * @author arman
 * @since 15/2/2016.
 *
 */
'use strict';

const fs = require('fs');
const path = require('path');
const globals = require('./globals');
const Images = globals.importModel('Images');

let initControllers = (app) => {
  let route = null;

  fs.readdirSync(path.resolve(__dirname, '../controllers')).forEach((file) => {
    if(file.substr(-3) === '.js') {
      route = require('../controllers/' + file);
      route.controller(app);
    }
  });
};

let initModels = () => {
  loadModels();

  return (
    globals
      .sequelize
      .sync({force: false})
      .then(() => {
        console.log('Finished database synchronization.');

        return installImages();
      })
      .catch((err) => {
        console.error('Error occurred during database synchronization:', err);
      })
  );
};

let loadModels = () => {
  fs.readdirSync(path.resolve(__dirname, '../models')).forEach((file) => {
    if(file.substr(-3) === '.js') {
      require('../models/' + file);
      console.log('Finished loading model:', file);
    }
  });
};

let installImages = () => {
  let images = [];

  fs.readdirSync(path.resolve(__dirname, '../public/images')).forEach((fileName, index) => {
    images[index] = {filename: fileName};
  });

  return (
    Images
      .count()
      .then((count) => {
        if(count === 0) {
          return (
            Images
              .bulkCreate(images)
              .then(() => {
                console.log('Successfully finished installing your images.');
              })
              .catch((err) => {
                console.error('Error occurred during image installation:', err);
              })
          );
        }
      })
  );
};

let registerStaticResources = (app, express) => {
  app.use(express.static(path.join(__dirname, '../public')));
};

let register404 = (app) => {
  app.use((req, res) => {
    res.render('404');
  });
};

module.exports.initApp = (app, express) => {
  return (
    Promise
      .resolve()
      .then(initControllers.bind(null, app))
      .then(initModels)
      .then(registerStaticResources.bind(null, app, express))
      .then(register404.bind(null, app))
      .then(() => {
        console.log('Successfully completed all bootstrapping jobs.')
      })
      .catch(() => {
        console.error('Oops!!! Error occurred during bootstrapping.');
      })
  );
};