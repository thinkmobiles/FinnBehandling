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

describe('Sub Treatments', function () {

    it('should not save without name', function (done) {
        factory.create('treatment', {name: null}, function (err) {

            expect(err).to.exist;
            expect(err.column).equal('name');
            expect(err.message).to.contain('violates not-null constraint');

            done();
        });
    });

    it('should not save name with over 30 characters', function (done) {
        var longString = '1234567890123456789012345678901';

        factory.create('treatment', {name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});