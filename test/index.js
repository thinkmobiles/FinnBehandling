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



    require('./handlers/hospitals');
    require('./handlers/news');
    require('./handlers/staticData');

