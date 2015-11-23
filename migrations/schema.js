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
            createTables,
            createDefaultArticles
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

    function createDefaultArticles(callback){
        knex(TABLES.NEWS)
            .select()
            .then(function (result) {
                if (result.length < 1) {

                    var articles = generateDefaultArticles();

                    knex(TABLES.NEWS)
                        .insert(articles)
                        .then(function () {
                            console.log('default articles are Created!');
                            callback();
                        })
                        .catch(function (err) {
                            console.log('default articles Creation Error: ' + err);
                            callback(err);
                        });
                } else {
                    callback();
                }
            })
    }

    function generateDefaultArticles() {
        var articles = [
            {
                id: 1,
                subject: 'VelVel.',
                content:
                    'Odit culpa vel possimus sint libero optio occaecati illo.' +
                    'Est qui itaque et.' +
                    'Ea commodi blanditiis.' +
                    'Temporibus a hic qui nemo explicabo sequi est vero.' +
                    'Itaque laudantium et quo occaecati omnis.' +

                    'Vel non dolor modi ullam et ex dolorum sed quas.' +
                    'Enim inventore voluptas enim reprehenderit sed hic provident aut.' +
                    'Ut et architecto.' +

                    'Aperiam similique quia a aliquam saepe tempore.' +
                    'Aliquam et sunt.' +
                    'Quas nemo dolor voluptatem sit in asperiores excepturi non.',
                source: 'Nesciunt.'
            }, {
                id: 2,
                subject: 'Dolor.',
                content:
                    'Vel non dolor modi ullam et ex dolorum sed quas.' +
                    'Enim inventore voluptas enim reprehenderit sed hic provident aut.' +
                    'Ut et architecto.' +

                    'Aperiam similique quia a aliquam saepe tempore.' +
                    'Aliquam et sunt.' +
                    'Quas nemo dolor voluptatem sit in asperiores excepturi non.',
                source: 'Enim.'
            }, {
                id: 3,
                subject: 'Lorem.',
                content:
                    'Odit culpa vel possimus sint libero optio occaecati illo.' +
                    'Est qui itaque et.' +
                    'Ea commodi blanditiis.' +
                    'Temporibus a hic qui nemo explicabo sequi est vero.' +
                    'Itaque laudantium et quo occaecati omnis.' +

                    'Aperiam similique quia a aliquam saepe tempore.' +
                    'Aliquam et sunt.' +
                    'Quas nemo dolor voluptatem sit in asperiores excepturi non.',
                source: 'Insput.'
            }
        ];

        return articles;
    }


    function setDefaultOptions () {


    }

    return {
        create: create,
        drop: drop,
        setDefaultData: setDefaultOptions
    }
};