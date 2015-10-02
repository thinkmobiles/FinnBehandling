module.exports = function (postGre, ParentModel) {
    var TABLES = require('../constants/tables');

    var NewsModel = ParentModel.extend({
        hasTimestamps: true,
        tableName: TABLES.NEWS
    });

    return NewsModel;
};
