var TABLES = require('../constants/tables');
var RESPONSES = require('../constants/responseMessages');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.TREATMENTS_LIST
    });
};