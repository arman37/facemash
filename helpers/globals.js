/**
 * Created by Arman on 15/2/2016.
 */
'use strict';

var globals = {
    importModel: function (modelName) {
        return require('../models/Model' + modelName);
    },

    importService: function (serviceName) {
        return require('../services/' + serviceName + 'Service');
    }

};

module.exports = globals;