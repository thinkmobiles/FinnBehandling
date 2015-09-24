var async = require('async');
var TABLES = require('../../constants/tables');

module.exports = function (knex, callback) {

    var dropDbQueue = [];
    var tablesNames = Object.keys(TABLES);
    var dropTableFunction;

    async.each(tablesNames, function (constantsTableName, callback) {

        dropTableFunction = function (callback) {
            knex(TABLES[constantsTableName]).del().exec(callback);
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
