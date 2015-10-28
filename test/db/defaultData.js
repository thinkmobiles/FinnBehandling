'use strict';
var async = require('async');
var fixtures;

module.exports.setUp = function (db, callback) {
    var factory = require('./factories')(db);

    function preparedFunction (name, count, result) {

        return function (callback) {
            createFakeData(result, name, count, callback);
        }
    }

    function createFakeData (result, name, count, callback) {

        factory.createMany(name, count, function (err, created) {

            var createdLength = created ? created.length : 0;

            if (err) {
                return callback(err);
            }

            for (var i = 0; i < createdLength; i++) {
                result[name][i] = created[i].id
            }

            callback();
        });
    }

    function createInstance (mainCallback) {
        var createStack = [];
        var fixturesObj = {
            treatment: [],
            sub_treatment: []
        };

        var fixturesNames = Object.keys(fixturesObj);
        var fixturesLength = fixturesNames.length;

        var _preparedFunc;

        while (fixturesLength--) {

            _preparedFunc = preparedFunction(fixturesNames[fixturesLength], 4, fixturesObj);

            createStack.push(_preparedFunc);
        }

        async.parallel(createStack, function () {

            mainCallback(fixturesObj);
        });
    }

    if (callback && typeof callback === 'function') {
        callback();
    }

    return (function () {
        if (!fixtures) {
            createInstance(function (result) {
                fixtures = result;

                return fixtures;
            });
        } else {

            return fixtures;
        }
    })();
};