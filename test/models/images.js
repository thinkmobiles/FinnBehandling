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

describe('Images', function () {

    it('should not save name with over 150 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901';

        factory.create('image', {name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save imageable_type with over 150 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901';

        factory.create('image', {imageable_type: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save imageable_field with over 50 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901';

        factory.create('image', {imageable_field: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});