module.exports = function (knex) {
    var TABLES = require('../constants/tables');
    var QUERY = require('./queryGenerator');
    var when = require('when');
    var async = require('../node_modules/async');
    var _ = require('lodash');

    function addExtentionUUID(cb) {

        knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
            .then(function () {
                cb()
            })
            .catch(cb)
    }

    function addExtentionPostGIS(cb) {

        knex.raw('CREATE EXTENSION IF NOT EXISTS postgis')
            .then(function () {
                cb()
            })
            .catch(cb);
    }

    function addExtentionPostGISTopology(cb) {

        knex.raw('CREATE EXTENSION IF NOT EXISTS postgis_topology')
            .then(function () {
                cb()
            })
            .catch(cb);
    }

    function createTables(callback) {
        var queryList = _.values(QUERY);

        async.eachSeries(queryList, function (query, cb) {

            knex.raw(query)
                .then(function () {
                    cb()
                })
                .catch(cb);
        }, callback);

    }

    function create() {
        async.series([
            addExtentionUUID,
            addExtentionPostGIS,
            addExtentionPostGISTopology,
            createTables

        ], function(errors) {
            if (errors) {
                console.log('===============================');
                console.log(errors);
                console.log('===============================');
            } else {
                console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                console.log('Tables Created!');
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');

            }
        });
    }

    function drop() {
        var tablesList = _.values(TABLES);

        knex .raw('DROP TABLE IF EXISTS ' + tablesList )
            .then(function () {
                console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                console.log('Tables Destroyed!');
                console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            })
            .catch(function (err) {

                if (err) {
                    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
                    console.log(err);
                    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
                }
            })
    }


    function setDefaultOptions () {


    }

    return {
        create: create,
        drop: drop,
        setDefaultData: setDefaultOptions
    }
};