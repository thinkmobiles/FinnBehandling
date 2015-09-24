'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var responseMessages = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers');
var files = require('./../db/base64Fixtures/files');
var images = require('./../db/base64Fixtures/images');

var TABLES = require('../../constants/tables');

describe('Clients', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);

    var url = conf.host;
    var agent = request.agent(url);

    before(function (done) {
        console.log('>>> before');
    });

    it('should create a new client for trainer', function (done) {

    });
});