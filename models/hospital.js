var TABLES = require('../constants/tables');

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        hasTimestamps: true,
        tableName: TABLES.HOSPITALS
    });
};