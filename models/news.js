module.exports = function (postGre, ParentModel) {
    var TABLES = require('../constants/tables');

    var NewsModel = ParentModel.extend({
        tableName: TABLES.NEWS
    });

    return NewsModel;
};
