var TABLES = require('../constants/tables');

var Models = function (PostGre) {
    "use strict";
    var _ = require('underscore');
    PostGre.plugin('visibility');

    var Model = PostGre.Model.extend({
        hasTimestamps: true,
        idAttribute: 'id',
        getName: function () {
            return this.tableName.replace(/s$/, '')
        }
    }, {
        fetchMe: function (queryObject, optionsObject) {
            return this.forge(queryObject).fetch(optionsObject);
        }
    });



    /*this[TABLES.FEESES] = require('./feeses')(PostGre, Model);
    this[TABLES.SYNCHRONIZES] = require('./synchronize')(PostGre, Model);
    this[TABLES.KIT_ORDERS] = require('./kitOrders')(PostGre, Model);
    this[TABLES.LOCATIONS] = require('./locations')(PostGre, Model);
    this[TABLES.MEMBERS] = require('./members')(PostGre, Model);*/
};
module.exports = Models;