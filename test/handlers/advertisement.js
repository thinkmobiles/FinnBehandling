'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var TABLES = require('../../constants/tables');
var fs = require('fs');
var path = require('path');


describe('Advertisements', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var advertisementId;
    var updatingAdvertisementId;
   

    before(function (done) {
        console.log('>>> before');

        factory.createMany('advertisement', 4, function (err, advertisements) {
            if (err) {
                return done(err);
            }

            advertisementId = advertisements[0].id;
            updatingAdvertisementId = advertisements[1].id;
            

            done();
        });
    });


    it('should create a new advertisement', function (done) {
        var data = {
            title: 'Example link',
            link: 'www.example.com'
        };

        agent
            .post('/advertisement')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.WAS_CREATED);


                helpers.getOneJustCreated(TABLES.ADVERTISEMENT, function (err, advertisement) {
                    if (err) {
                        return done(err);
                    }

                    expect(advertisement).to.exist;
                    expect(advertisement).to.be.instanceOf(Object);
                    expect(advertisement).to.have.property('title');
                    expect(advertisement.title).equal(data.title);
                    expect(advertisement).to.have.property('link');
                    expect(advertisement.link).equal(data.link);

                    done();
                });
            });
    });

    it('should get one advertisement', function (done) {
        agent
            .get('/advertisement/' + advertisementId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var advertisement = res.body;

                expect(advertisement).to.exist;
                expect(advertisement).to.be.instanceOf(Object);
                expect(advertisement).to.have.property('title');
                expect(advertisement).to.have.property('link');

                done();
            });
    });


    it('should get all advertisements', function (done) {
        agent
            .get('/advertisement')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var advertisements = res.body;

                expect(advertisements).to.be.not.empty;
                expect(advertisements).to.be.instanceOf(Array);
                expect(advertisements.length).least(4);
                expect(advertisements[0]).to.be.instanceOf(Object);
                expect(advertisements[0]).to.have.property('title');
                expect(advertisements[0]).to.have.property('link');

                done();
            });
    });

    it('should get advertisements count', function (done) {
        agent
            .get('/advertisement/count')
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

    it('should update advertisement', function (done) {
        var data = {
            title: 'Example link',
            link: 'www.example.com'
        };

        agent
            .put('/advertisement/' + updatingAdvertisementId)
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_SUCCESS);


                helpers.getOne(TABLES.ADVERTISEMENT, updatingAdvertisementId, function (err, advertisement) {
                    if (err) {
                        return done(err);
                    }

                    expect(advertisement).to.exist;
                    expect(advertisement).to.be.instanceOf(Object);
                    expect(advertisement).to.have.property('title');
                    expect(advertisement.title).equal(data.title);
                    expect(advertisement).to.have.property('link');
                    expect(advertisement.link).equal(data.link);

                    done();
                });
            });
    });


    it('should delete advertisement', function(done) {
        agent
            .delete('/advertisement/' + advertisementId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                helpers.getOne(TABLES.ADVERTISEMENT, advertisementId, function (err, advertisement) {
                    if (err) {
                        return done(err);
                    }

                    expect(advertisement).not.to.exist;

                    done();
                });

            });
    });
});
