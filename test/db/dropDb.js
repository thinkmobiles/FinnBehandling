var async = require('async');
var TABLES = require('../../constants/tables');
var _ = require('underscore');

module.exports = function (knex, callback) {

    var dropDbQueue = [];
    var exeptionTable = ['HOSPITAL_TYPES_LIST', 'REGIONS_LIST', 'SUB_TREATMENTS_LIST', 'TREATMENTS_LIST'];
    var allTables = Object.keys(TABLES);
    var tablesNames = _.difference(allTables, exeptionTable);
    var dropTableFunction;

    async.each(tablesNames, function (constantsTableName, callback) {

        dropTableFunction = function (callback) {
            knex(TABLES[constantsTableName]).del().asCallback(callback);
        };

        dropDbQueue.push(dropTableFunction);

        callback();

    }, function (err) {
        if (err) {
            return callback(err);
        }

        async.parallel(dropDbQueue, callback);
    });

    console.log('==============================================');
    console.log('DB has dropped');
    console.log('==============================================');
};
