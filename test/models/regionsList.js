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

describe('Regions', function () {

    it('should not save zip_code with over 35 characters', function (done) {
        var longString = '123456789012345678901234567890123456';

        factory.create('region', {zip_code: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save kommune_name with over 50 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901';

        factory.create('region', {kommune_name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save fylke_name with over 50 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901';

        factory.create('region', {fylke_name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});