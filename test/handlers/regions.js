'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');

describe('Regions', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');


    var url = conf.host;
    var agent = request.agent(url);

    it('should get fylkes', function (done) {

        agent
            .get('/regions/fylkes')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var fylkes = res.body;

                expect(fylkes).to.exist;
                expect(fylkes).to.be.instanceOf(Array);
                expect(fylkes.length).equal(19);

                done();

            });
    });

    it('should update regions DB', function (done) {

        agent
            .post('/regions/updateDB')
            .send({})
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_REGIONS_DB_SUCCESS);

                done();
            });
    });
});