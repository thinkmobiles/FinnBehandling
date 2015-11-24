'use strict';
var async = require('async');
var request = require('supertest');
var expect = require("chai").expect;

var Config = require('./config');
var dropDb = require('./db/dropDb');


var conf = new Config();
var app = conf.app;
var PostGre = app.get('PostGre');
var defaultData = require('./db/defaultData');
var clearFixtures = require('./db/destroyFixtureFiles');

before(function (done) {
    console.log('>>> before all');

    async.series([
        function (callback) {
            dropDb(PostGre.knex, callback);
        },
        function (callback) {
            defaultData.setUp(PostGre, callback);
        }
    ], done);
});


describe('Models', function () {
    require('./models/hospitals');
    require('./models/images');
    require('./models/news');
    require('./models/regionsList');
    require('./models/subTreatmentsList');
    require('./models/treatmentsList');
});

describe('Handlers', function () {
    require('./handlers/hospitals');
    require('./handlers/news');
    require('./handlers/staticData');
    require('./handlers/advertisement');
    require('./handlers/users');
    require('./handlers/regions');
    require('./handlers/treatments');
    require('./handlers/webRecommendations');
    require('./handlers/staticNews');
});

after(function (done) {
    console.log('>>> after all');

    clearFixtures(done);
});

