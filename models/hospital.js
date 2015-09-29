var TABLES = require('../constants/tables');

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        idAttribute: 'id',
        hasTimestamps: true,
        tableName: TABLES.HOSPITALS
    });
};