var TABLES = require('../constants/tables');

var Models = function (PostGre) {
    "use strict";
    var _ = require('underscore');
    PostGre.plugin('visibility');

    var Model = PostGre.Model.extend({
        getName: function () {
            return this.tableName.replace(/s$/, '')
        }
    }, {
        fetchMe: function (queryObject, optionsObject) {
            return this.forge(queryObject).fetch(optionsObject);
        }
    });



    this[TABLES.HOSPITALS] = require('./hospital')(PostGre, Model);
    this[TABLES.HOSPITAL_TYPES_LIST] = require('./hospitalTypesList')(PostGre, Model);
    this[TABLES.REGIONS_LIST] = require('./regionsList')(PostGre, Model);
    this[TABLES.TREATMENTS] = require('./treatment')(PostGre, Model);
    this[TABLES.TREATMENTS_LIST] = require('./treatmentsList')(PostGre, Model);
    this[TABLES.SUB_TREATMENTS] = require('./subTreatment')(PostGre, Model);
    this[TABLES.SUB_TREATMENTS_LIST] = require('./subTreatmentsList')(PostGre, Model);
    this[TABLES.HOSPITAL_TEXTS] = require('./hospitalText')(PostGre, Model);

};
module.exports = Models;