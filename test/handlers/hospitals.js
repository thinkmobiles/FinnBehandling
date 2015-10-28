'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var images = require('./../db/base64Fixtures/images');
var defaultData = require('./../db/defaultData');
var imageGenerator = require('./../helpers/imageGenerator');
var fs = require('fs');
var path = require('path');


function getImageUrl(imageName) {

    return path.join(__dirname, '..', 'uploads', 'images', imageName);
}

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
    var updatingHospitalId;
    var hospitalImage;
    var updatingHospitalImage;
    var fixtures;

    before(function (done) {
        console.log('>>> before');

        factory.createMany('hospital', 4, function (err, hospitals) {
            if (err) {
                return done(err);
            }

            imageGenerator(hospitals, TABLES.HOSPITALS, 'logo', factory, function (err, images) {
                if (err) {
                    return done(err);
                }

                hospitalImage = images[0].toJSON();
                updatingHospitalImage = images[1].toJSON();

                hospitalId = hospitalImage.imageable_id;
                updatingHospitalId = updatingHospitalImage.imageable_id;

                fixtures = defaultData.setUp(PostGre, done);
            });
        });
    });

    it('should create a new hospital', function (done) {

        var createClinicData = {
            postcode: '0010',
            is_paid: false,
            name: 'Clinic test1',
            sub_treatments: fixtures.sub_treatment,
            description: 'Lorem ipsum dolor si',
            phone_number: ['+380660237194'],
            email: ['dummy@mail.com'],
            web_address: 'www.clinic.com',
            logo: images[TABLES.HOSPITALS][0]
        };

        agent
            .post('/hospitals')
            .send(createClinicData)
            .expect(201)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                var response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.WAS_CREATED);
                expect(typeof response.hospital_id).equal('number');


                async.waterfall([
                    function (callback) {

                        helpers.getOneJustCreated(TABLES.HOSPITALS, function (err, hospital) {
                            if (err) {
                                return callback(err);
                            }

                            expect(hospital).to.exist;
                            expect(hospital).to.be.instanceOf(Object);
                            expect(hospital).to.have.property('is_paid');
                            expect(hospital.is_paid).equal(createClinicData.is_paid);
                            expect(hospital).to.have.property('name');
                            expect(hospital.name).equal(createClinicData.name);
                            expect(hospital).to.have.property('description');
                            expect(hospital.description).equal(createClinicData.description);
                            expect(hospital).to.have.property('phone_number');
                            expect(hospital.phone_number[0]).equal(createClinicData.phone_number[0]);
                            expect(hospital).to.have.property('email');
                            expect(hospital.email[0]).equal(createClinicData.email[0]);

                            callback( null, hospital);
                        });
                    },
                    function (hospital, callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: hospital.id, imageable_type: TABLES.HOSPITALS}, function (err, logos) {
                            if (err) {
                                return callback(err);
                            }

                            var logo = logos[0];
                            var imageUrl;

                            expect(logo).to.exist;
                            expect(logo).to.be.instanceOf(Object);
                            expect(logo).to.have.property('name');
                            expect(logo).to.have.property('imageable_id');
                            expect(logo.imageable_id).equal(hospital.id);
                            expect(logo).to.have.property('imageable_type');
                            expect(logo.imageable_type).equal(TABLES.HOSPITALS);
                            expect(logo).to.have.property('imageable_field');
                            expect(logo.imageable_field).equal('logo');

                            imageUrl = getImageUrl(logo.name, 'images');

                            fs.exists(imageUrl, function (exists) {

                                expect(exists).equal(true);

                                callback();
                            });
                        });
                    }
                ], done);
            });
    });

    it('should fail to create a new hospital with existing name', function (done) {

        var createClinicData = {
            postcode: '0010',
            is_paid: false,
            name: 'Clinic test1',
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

                var response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.error).equal(RESPONSES.NON_UNIQUE_NAME_ERROR);

                done();
            });
    });

    it('should update hospital', function (done) {

        var updateClinicData = {
            postcode: '0021',
            is_paid: false,
            name: 'Clinic test2',
            sub_treatments: [fixtures.sub_treatment[2], fixtures.sub_treatment[3]],
            description: 'Lorem ipsum dolor si',
            phone_number: ['+380660237194'],
            email: ['dummy@mail.com'],
            web_address: 'www.clinic.com',
            logo: images[TABLES.HOSPITALS][1]
        };

        agent
            .put('/hospitals/' + updatingHospitalId)
            .send(updateClinicData)
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                var response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.UPDATED_SUCCESS);
                expect(response.hospital_id).equal(updatingHospitalId);

                async.waterfall([
                    function (callback) {

                        helpers.getOne(TABLES.HOSPITALS, updatingHospitalId, function (err, hospital) {
                            if (err) {
                                return callback(err);
                            }

                            expect(hospital).to.exist;
                            expect(hospital).to.be.instanceOf(Object);
                            expect(hospital).to.have.property('is_paid');
                            expect(hospital.is_paid).equal(updateClinicData.is_paid);
                            expect(hospital).to.have.property('name');
                            expect(hospital.name).equal(updateClinicData.name);
                            expect(hospital).to.have.property('description');
                            expect(hospital.description).equal(updateClinicData.description);
                            expect(hospital).to.have.property('phone_number');
                            expect(hospital.phone_number[0]).equal(updateClinicData.phone_number[0]);
                            expect(hospital).to.have.property('email');
                            expect(hospital.email[0]).equal(updateClinicData.email[0]);

                            callback( null, hospital);
                        });
                    },
                    function (hospital, callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: hospital.id, imageable_type: TABLES.HOSPITALS}, function (err, logos) {
                            if (err) {
                                return callback(err);
                            }

                            var logo = logos[0];
                            var imageUrl;

                            expect(logo).to.exist;
                            expect(logo).to.be.instanceOf(Object);
                            expect(logo).to.have.property('id');
                            expect(logo.name).not.equal(updatingHospitalImage.name);
                            expect(logo).to.have.property('name');
                            expect(logo).to.have.property('imageable_id');
                            expect(logo.imageable_id).equal(hospital.id);
                            expect(logo).to.have.property('imageable_type');
                            expect(logo.imageable_type).equal(TABLES.HOSPITALS);
                            expect(logo).to.have.property('imageable_field');
                            expect(logo.imageable_field).equal('logo');

                            imageUrl = getImageUrl(logo.name);

                            fs.exists(updatingHospitalImage.image_url, function (exists) {

                                expect(exists).equal(false);

                                fs.exists(imageUrl, function (exists) {

                                    expect(exists).equal(true);

                                    callback();
                                });
                            });
                        });
                    }
                ], done);
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

                var response = res.body;
                var imageUrl;

                expect(response).to.be.instanceOf(Object);
                expect(response).to.have.property('id');
                expect(response.id).equal(hospitalId);
                expect(response).to.have.property('name');
                expect(response).to.have.property('phone_number');
                expect(response).to.have.property('address');
                expect(response).to.have.property('sub_treatments');
                expect(response).to.have.property('logo');
                expect(response.logo).to.be.instanceOf(Object);
                expect(response.logo).to.have.property('imageable_id');
                expect(response.logo.imageable_id).equal(hospitalId);
                expect(response.logo).to.have.property('image_url');

                imageUrl = getImageUrl(response.logo.name);

                fs.exists(imageUrl, function (exists) {

                    expect(exists).equal(true);

                    done();
                });
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

                var response = res.body;

                expect(response).to.be.instanceOf(Array);

                done();
            });
    });

    it('should get conflict hospitals', function (done) {

        agent
            .get('/hospitals/conflicts')
            .send()
            .expect(200)
            .end(function (err, res) {

                if (err) {
                    return done(err);
                }

                var response = res.body;

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

                var response = res.body;

                expect(response).to.be.instanceOf(Object);
                expect(response.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                async.series([
                    function (callback) {

                        helpers.getOne(TABLES.HOSPITALS, hospitalId, function (err, hospital) {
                            if (err) {
                                return callback(err);
                            }

                            expect(hospital).not.to.exist;

                            callback();
                        });
                    },
                    function (callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: hospitalId, imageable_type: TABLES.HOSPITALS}, function (err, logos) {
                            if (err) {
                                return callback(err);
                            }

                            //expect(logos.length).equal(0);

                            /*var imageUrl = getImageUrl(hospitalImage.name);

                            fs.exists(imageUrl, function (exists) {

                                expect(exists).equal(false);

                                callback();
                            });*/

                            callback();
                        });
                    }
                ], done);
            });
    });
});