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

describe('Hospital Types', function () {

    it('should not save name with over 80 characters', function (done) {
        var longString = '123456789012345678901234567890123456789012345678901234567890123456789012345678901';

        factory.create('hospital_type', {name: longString}, function (err) {

            expect(err).to.exist;
            expect(err.message).to.contain('value too long');

            done();
        });
    });

});