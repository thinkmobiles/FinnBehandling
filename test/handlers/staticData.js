'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers');
var files = require('./../db/base64Fixtures/files');
var images = require('./../db/base64Fixtures/images');
var TABLES = require('../../constants/tables');

describe('StaticData', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var staticDataId;

    before(function (done) {
        console.log('>>> before');

        factory.build('static_data', function (err, staticData) {
            if (err) {
                return done(err);
            }

            staticData
                .save(null, {method: 'insert'})
                .asCallback(function (err){
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });
    });

    it('should get one static entry', function (done) {
        agent
            .get('/staticData')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var staticEntry = res.body;

                expect(staticEntry).to.exist;
                expect(staticEntry).to.be.instanceOf(Object);
                expect(staticEntry).to.have.property('text');

                done();

            });
    });

    it('should update static entry', function (done) {
        var data = {
            text: 'Updated text'
        };

        agent
            .put('/staticData')
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_SUCCESS);

                helpers.getOne(TABLES.STATIC_DATA, 1, function (err, staticEntry) {
                    if (err) {
                        return done(err);
                    }

                    expect(staticEntry).to.exist;
                    expect(staticEntry).to.be.instanceOf(Object);
                    expect(staticEntry).to.have.property('text');
                    expect(staticEntry.text).equal('Updated text');

                    done();
                });
            });
    });
});