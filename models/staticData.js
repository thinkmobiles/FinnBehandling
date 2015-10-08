module.exports = function (postGre, ParentModel) {
    var TABLES = require('../constants/tables');

    var StaticDataModel = ParentModel.extend({
        tableName: TABLES.STATIC_DATA
    });

    return StaticDataModel;
};
