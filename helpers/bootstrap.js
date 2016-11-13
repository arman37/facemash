/**
 * Created by Arman on 15/2/2016.
 */
'use strict';

var fs = require('fs')
    ,path = require('path')
    ,globals = require('./globals')
    ,Images = globals.importModel('Images');

var initControllers = function (app) {
    var route = null;
    fs.readdirSync(path.resolve(__dirname, '../controllers')).forEach(function (file) {
        if(file.substr(-3) === '.js') {
            route = require('../controllers/' + file);
            route.controller(app);
        }
    });
};

var initModels = function () {
    loadModels();
    globals
        .sequelize
        .sync({force: false})
        .then(function () {
            console.log('Finished database synchronization.');
            installImages();
        })
        .catch(function (err) {
            console.error('Error occurred during database synchronization:', err);
        });
};

var loadModels = function () {
    fs.readdirSync(path.resolve(__dirname, '../models')).forEach(function (file) {
        if(file.substr(-3) === '.js') {
            require('../models/' + file);
            console.log('Finished loading model:', file);
        }
    });
};

var installImages = function () {
    var images = [];
    fs.readdirSync(path.resolve(__dirname, '../public/images')).forEach(function (fileName, index) {
        images[index] = {filename: fileName};
    });

    Images
        .count()
        .then(function (count) {
            if(count === 0) {
                Images
                    .bulkCreate(images)
                    .then(function () {
                        console.log('Successfully finished installing your images.');
                    })
                    .catch(function (err) {
                        console.error('Error occurred during image installation:', err);
                    });
            }
        });
};

var registerStaticResources = function (app, express) {
    app.use(express.static(path.join(__dirname, '../public')));
};

var register404 = function (app) {
    app.use(function (req, res) {
        res.render('404');
    });
};

module.exports.initApp = function (app, express) {
    initControllers(app);
    initModels();
    registerStaticResources(app, express);
    register404(app);
};