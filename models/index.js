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



    this[TABLES.HOSPITALS] = require('./hospital')(PostGre, Model);

};
module.exports = Models;