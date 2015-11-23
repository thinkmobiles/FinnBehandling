'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var files = require('./../db/base64Fixtures/files');
var images = require('./../db/base64Fixtures/images');
var TABLES = require('../../constants/tables');

describe('Treatments subtreatments', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var treatmentId;

    before(function (done) {
        console.log('>>> before');



        factory.createMany('treatment', 4, function (err, treatments) {
            if (err) {
                return done(err);
            }

            factory.createMany('sub_treatment', 4, function (err) {
                if (err) {
                    return done(err);
                }

                treatmentId = treatments[0].id;

                done();
            });
        });
    });

    it('should get one treatment', function (done) {
        agent
            .get('/treatment')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var treatments = res.body;

                expect(treatments).to.exist;
                expect(treatments).to.be.instanceOf(Array);
                expect(treatments[0]).to.be.instanceOf(Object);
                expect(treatments[0]).to.have.property('id');
                expect(treatments[0]).to.have.property('name');

                done();

            });
    });

    it('should get subTreatments by treatment id', function (done) {
        agent
            .get('/treatment/' + treatmentId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var subTreatments = res.body;

                expect(subTreatments).to.exist;
                expect(subTreatments).to.be.instanceOf(Array);
                expect(subTreatments[0]).to.be.instanceOf(Object);
                expect(subTreatments[0]).to.have.property('id');
                expect(subTreatments[0]).to.have.property('name');
                expect(subTreatments[0]).to.have.property('treatment_id');


                done();

            });
    });
});