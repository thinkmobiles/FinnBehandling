'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers');
var files = require('./../db/base64Fixtures/files');
var images = require('./../db/base64Fixtures/images');
var defaultData = require('./../db/defaultData');

var TABLES = require('../../constants/tables');

describe('Hospitals', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var hospitalId;
    var response;
    var fixtures;

    before(function (done) {
        console.log('>>> before');

        factory.createMany('hospital', 4, function (err, hospitals) {
            if (err) {
                return done(err);
            }

            hospitalId = hospitals[0].id;

            fixtures = defaultData.setUp(PostGre, done);
        });
    });

    it('should create a new hospital', function (done) {

        var createClinicData = {
            region_id: fixtures.region[0],
            is_paid: false,
            type_id: fixtures.hospital_type[0],
            name: 'Clinic test1',
            treatment_ids: fixtures.treatment,
            sub_treatments: fixtures.sub_treatment,
            description: 'Lorem ipsum dolor si',
            phone_number: ['+380660237194'],
            email: ['dummy@mail.com'],
            web_address: 'www.clinic.com'
        };

        agent
            .post('/hospitals')
            .send(createClinicData)
            .expect(201)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.WAS_CREATED);
                expect(typeof response.hospital_id).equal('number');

                done();
            });
    });

    it('should fail to create a new hospital with existing name', function (done) {

        var createClinicData = {
            region_id: fixtures.region[0],
            is_paid: false,
            type_id: fixtures.hospital_type[0],
            name: 'Clinic test1',
            treatment_ids: [fixtures.treatment[0], fixtures.treatment[1]],
            sub_treatments: [fixtures.sub_treatment[0], fixtures.sub_treatment[1]],
            description: 'Lorem ipsum dolor si',
            phone_number: ['+380660237194'],
            email: ['dummy@mail.com'],
            web_address: 'www.clinic.com'
        };

        agent
            .post('/hospitals')
            .send(createClinicData)
            .expect(400)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.error).equal(RESPONSES.NON_UNIQUE_NAME_ERROR);

                done();
            });
    });

    it('should update hospital', function (done) {

        var updateClinicData = {
            region_id: fixtures.region[1],
            is_paid: false,
            type_id: fixtures.hospital_type[1],
            name: 'Clinic test2',
            treatment_ids: [fixtures.treatment[2], fixtures.treatment[3]],
            sub_treatments: [fixtures.sub_treatment[2], fixtures.sub_treatment[3]],
            description: 'Lorem ipsum dolor si',
            phone_number: ['+380660237194'],
            email: ['dummy@mail.com'],
            web_address: 'www.clinic.com'
        };

        agent
            .put('/hospitals/' + hospitalId)
            .send(updateClinicData)
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.UPDATED_SUCCESS);
                expect(response.hospital_id).equal(hospitalId);

                helpers.getOne(TABLES.HOSPITALS, hospitalId, function (err, hospital) {
                    if (err) {
                        return done(err);
                    }

                    expect(hospital).to.exist;
                    expect(hospital.name).equal(updateClinicData.name);

                    done();
                });
            });
    });

    it('should get hospital by id', function (done) {

        agent
            .get('/hospitals/' + hospitalId)
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response).to.have.property('id');
                expect(response.id).equal(hospitalId);
                expect(response).to.have.property('name');
                expect(response).to.have.property('web_address');
                expect(response).to.have.property('phone_number');
                expect(response).to.have.property('type');
                expect(response).to.have.property('address');
                expect(response).to.have.property('treatments');
                expect(response).to.have.property('sub_treatments');

                done();
            });
    });

    it('should get hospitals', function (done) {

        agent
            .get('/hospitals')
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Array);

                done();
            });
    });

    it('should get hospitals count', function (done) {
        agent
            .get('/hospitals/count')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var result = res.body;

                expect(result).to.be.not.empty;
                expect(result).to.be.instanceOf(Object);
                expect(result.count).to.be.not.empty;
                expect(result.count).least(4);

                done();
            });
    });

    it('should delete hospital by id', function (done) {

        agent
            .delete('/hospitals/' + hospitalId)
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                done();
            });
    });
});