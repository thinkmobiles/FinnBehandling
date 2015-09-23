var TABLES = require('../constants/tables');
var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');

module.exports = function (PostGre, ParentModel) {
    return ParentModel.extend({
        tableName: TABLES.MEMBERS,
        hasTimestamps: ['CreatedAt'],
        idAttribute: "MemberNumber"
    });
};