'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var Config = require('../config');

var TABLES = require('../../constants/tables');

var conf = new Config();
var app = conf.app;
var PostGre = app.get('PostGre');

var factory = require('../db/factories')(PostGre);

describe('News', function () {

    it('should not save subject with over 80 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901234567890123456789012345678901';

        factory.create('news_article', {subject: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save source with over 50 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901';

        factory.create('news_article', {source: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});