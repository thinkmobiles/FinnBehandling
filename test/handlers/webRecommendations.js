'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var images = require('./../db/base64Fixtures/images');
var TABLES = require('../../constants/tables');
var fs = require('fs');
var path = require('path');

function getImageUrl(imageName) {

    return path.join(__dirname, '..', 'uploads', 'images', imageName);
}

describe('WebRecommendations', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var recommendationId;
    var updatingRecommendationId;

    before(function (done) {
        console.log('>>> before');

        factory.createMany('webRecommendation_article', 4, function (err, recommendstions) {
            if (err) {
                return done(err);
            }
            recommendationId = recommendstions[0].id;
            updatingRecommendationId = recommendstions[1].id;

            done();
        });
    });

    it('should get one recommendation', function (done) {
        agent
            .get('/webRecommendations/' + recommendationId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var recommendation = res.body;

                expect(recommendation).to.exist;
                expect(recommendation).to.be.instanceOf(Object);
                expect(recommendation).to.have.property('name');
                expect(recommendation).to.have.property('link');

                done();
            });
    });

    it('should create a new recommendation', function (done) {
        var data = {
            name: 'Clinic research',
            link: 'Lorem ipsum dolor si'
        };

        agent
            .post('/webRecommendations')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.WAS_CREATED);

                async.waterfall([
                    function (callback) {

                        helpers.getOneJustCreated(TABLES.WEB_RECOMMENDATIONS, function (err, recommendation) {
                            if (err) {
                                return callback(err);
                            }

                            expect(recommendation).to.exist;
                            expect(recommendation).to.be.instanceOf(Object);
                            expect(recommendation).to.have.property('name');
                            expect(recommendation.name).equal(data.name);
                            expect(recommendation).to.have.property('link');
                            expect(recommendation.link).equal(data.link);

                            callback( null, recommendation);
                        });
                    }
                ], done);
            });
    });

    it('should get all webRecommendations', function (done) {
        agent
            .get('/webRecommendations')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var recommendation = res.body;

                expect(recommendation).to.be.not.empty;
                expect(recommendation).to.be.instanceOf(Array);
                expect(recommendation.length).least(4);
                expect(recommendation[0]).to.be.instanceOf(Object);
                expect(recommendation[0]).to.have.property('name');
                expect(recommendation[0]).to.have.property('link');

                done();
            });
    });

    it('should update recommendation', function (done) {
        var data = {
            name: 'Updated research',
            link: 'Lorem ipsum dolor si'
        };

        agent
            .put('/webRecommendations/' + updatingRecommendationId)
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_SUCCESS);

                async.waterfall([
                    function (callback) {

                        helpers.getOne(TABLES.WEB_RECOMMENDATIONS, updatingRecommendationId, function (err, recommendation) {
                            if (err) {
                                return callback(err);
                            }

                            expect(recommendation).to.exist;
                            expect(recommendation).to.be.instanceOf(Object);
                            expect(recommendation).to.have.property('name');
                            expect(recommendation.name).equal(data.name);
                            expect(recommendation).to.have.property('link');
                            expect(recommendation.link).equal(data.link);

                            callback( null, recommendation);
                        });
                    }
                ], done);
            });
    });

    it('should delete recommendation', function(done){
        agent
            .delete('/webRecommendations/' + recommendationId)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    return done(err);
                }
                expect(res.body.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                async.waterfall([
                    function (callback) {

                        helpers.getOne(TABLES.WEB_RECOMMENDATIONS, recommendationId, function (err, recommendation) {
                            if (err) {
                                return callback(err);
                            }

                            expect(recommendation).not.to.exist;

                            callback();
                        });
                    }
                ], done);

            });
    });

});