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

describe('Hospitals', function () {

    it('should not save without name', function (done) {
        factory.create('hospital', {name: null}, function (err) {

            expect(err).to.exist;
            expect(err.column).equal('name');
            expect(err.message).to.contain('violates not-null constraint');

            done();
        });
    });

    it('should not save name with over 80 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901234567890123456789012345678901';

        factory.create('hospital', {name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

    it('should not save without postcode', function (done) {
        factory.create('hospital', {postcode: null}, function (err) {

            expect(err).to.exist;
            expect(err.column).equal('postcode');
            expect(err.message).to.contain('violates not-null constraint');

            done();
        });
    });

    it('should not save without paid status', function (done) {
        factory.create('hospital', {is_paid: null}, function (err) {

            expect(err).to.exist;
            expect(err.column).equal('is_paid');
            expect(err.message).to.contain('violates not-null constraint');

            done();
        });
    });

    it('should not save address with over 40 characters', function (done) {
        var longString = '12345678901234567890123456789012345678901';

        factory.create('hospital', {address: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});