var async = require('async');
var TABLES = require('../../constants/tables');
var _ = require('underscore');

var grunt = require('grunt');
var runTask = require('grunt-run-task');
//var gruntClean = require('grunt-contrib-clean');

module.exports = function (callback) {
    runTask.loadNpmTasks('grunt-contrib-clean');

    var task = runTask.task('clean',  {
        cleanFixtures: {
            //src: [ './test/uploads/images/fixture_*.*'],
            src: [ './test/uploads/images/*.*'],
            force: true
        }
    });

    task.run('cleanFixtures', function (err, task) {
        if (err) {
            return callback(err);
        }

        console.log('==============================================');
        console.log('Fixtures have dropped');
        console.log('==============================================');

        callback();
    });
};