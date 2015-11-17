'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var images = require('./../db/base64Fixtures/images');
var TABLES = require('../../constants/tables');
var imageGenerator = require('./../helpers/imageGenerator');
var fs = require('fs');
var path = require('path');


function getImageUrl(imageName) {

    return path.join(__dirname, '..', 'uploads', 'images', imageName);
}

describe('News', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);


    var url = conf.host;
    var agent = request.agent(url);

    var articleId;
    var updatingArticleId;
    var articleImage;
    var updatingArticleImage;

    before(function (done) {
        console.log('>>> before');

        factory.createMany('news_article', 4, function (err, news) {
            if (err) {
                return done(err);
            }

            imageGenerator(news, TABLES.NEWS, 'image', factory, function (err, images) {
                if (err) {
                    return done(err);
                }

                articleImage = images[0].toJSON();
                updatingArticleImage = images[1].toJSON();

                articleId = articleImage.imageable_id;
                updatingArticleId = updatingArticleImage.imageable_id;

                done();
            });
        });
    });

    it('should create a new article', function (done) {
        var data = {
            subject: 'Clinic research',
            content: 'Lorem ipsum dolor si',
            source: 'Newspaper',
            image: images[TABLES.NEWS][0]
        };

        agent
            .post('/news')
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

                        helpers.getOneJustCreated(TABLES.NEWS, function (err, article) {
                            if (err) {
                                return callback(err);
                            }

                            expect(article).to.exist;
                            expect(article).to.be.instanceOf(Object);
                            expect(article).to.have.property('subject');
                            expect(article.subject).equal(data.subject);
                            expect(article).to.have.property('content');
                            expect(article.content).equal(data.content);
                            expect(article).to.have.property('source');
                            expect(article.source).equal(data.source);

                            callback( null, article);
                        });
                    },
                    function (article, callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: article.id, imageable_type: TABLES.NEWS}, function (err, images) {
                            if (err) {
                                return callback(err);
                            }

                            var image = images[0];
                            var imageUrl;

                            expect(image).to.exist;
                            expect(image).to.be.instanceOf(Object);
                            expect(image).to.have.property('name');
                            expect(image).to.have.property('imageable_id');
                            expect(image.imageable_id).equal(article.id);
                            expect(image).to.have.property('imageable_type');
                            expect(image.imageable_type).equal(TABLES.NEWS);
                            expect(image).to.have.property('imageable_field');
                            expect(image.imageable_field).equal('image');

                            imageUrl = getImageUrl(image.name);

                            fs.exists(imageUrl, function (exists) {

                                expect(exists).equal(true);

                                callback();
                            });
                        });
                    }
                ], done);
            });
    });

    it('should get one article', function (done) {
        agent
            .get('/news/' + articleId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                   return done(err);
                }

                var article = res.body;
                var imageUrl;

                expect(article).to.exist;
                expect(article).to.be.instanceOf(Object);
                expect(article).to.have.property('subject');
                expect(article).to.have.property('content');
                expect(article).to.have.property('source');
                expect(article).to.have.property('image');
                expect(article.image).to.be.instanceOf(Object);
                expect(article.image).to.have.property('imageable_id');
                expect(article.image.imageable_id).equal(articleId);
                expect(article.image).to.have.property('image_url');

                imageUrl = getImageUrl(article.image.name);

                fs.exists(imageUrl, function (exists) {

                    expect(exists).equal(true);

                    done();
                });
            });
    });

    it('should get all news', function (done) {
        agent
            .get('/news')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var article = res.body;

                expect(article).to.be.not.empty;
                expect(article).to.be.instanceOf(Array);
                expect(article.length).least(4);
                expect(article[0]).to.be.instanceOf(Object);
                expect(article[0]).to.have.property('subject');
                expect(article[0]).to.have.property('content');
                expect(article[0]).to.have.property('source');

                done();
            });
    });

    it('should get news count', function (done) {
        agent
            .get('/news/count')
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

    it('should update article', function (done) {
        var data = {
            subject: 'Updated research',
            content: 'Lorem ipsum dolor si',
            source: 'Updated Newspaper',
            image: images[TABLES.NEWS][1]
        };

        agent
            .put('/news/' + updatingArticleId)
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

                        helpers.getOne(TABLES.NEWS, updatingArticleId, function (err, article) {
                            if (err) {
                                return callback(err);
                            }

                            expect(article).to.exist;
                            expect(article).to.be.instanceOf(Object);
                            expect(article).to.have.property('subject');
                            expect(article.subject).equal(data.subject);
                            expect(article).to.have.property('content');
                            expect(article.content).equal(data.content);
                            expect(article).to.have.property('source');
                            expect(article.source).equal(data.source);

                            callback( null, article);
                        });
                    },
                    function (article, callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: article.id, imageable_type: TABLES.NEWS}, function (err, images) {
                            if (err) {
                                return callback(err);
                            }

                            var image = images[0];
                            var imageUrl;

                            expect(image).to.exist;
                            expect(image).to.be.instanceOf(Object);
                            expect(image).to.have.property('id');
                            expect(image).to.have.property('name');
                            expect(image.name).not.equal(updatingArticleImage.name);
                            expect(image).to.have.property('imageable_id');
                            expect(image.imageable_id).equal(article.id);
                            expect(image).to.have.property('imageable_type');
                            expect(image.imageable_type).equal(TABLES.NEWS);
                            expect(image).to.have.property('imageable_field');
                            expect(image.imageable_field).equal('image');

                            imageUrl = getImageUrl(image.name);

                            fs.exists(imageUrl, function (exists) {

                                expect(exists).equal(true);

                                fs.exists(updatingArticleImage.image_url, function (exists) {

                                    expect(exists).equal(false);

                                    callback();
                                });
                            });
                        });
                    }
                ], done);
            });
    });

    it('should delete article', function(done){
        agent
            .delete('/news/' + articleId)
            .expect(200)
            .end(function(err, res){
                if (err) {
                    return done(err);
                }
                expect(res.body.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                async.waterfall([
                    function (callback) {

                        helpers.getOne(TABLES.NEWS, articleId, function (err, article) {
                            if (err) {
                                return callback(err);
                            }

                            expect(article).not.to.exist;

                            callback();
                        });
                    },
                    function (callback) {

                        helpers.getByParams(TABLES.IMAGES, {imageable_id: articleId, imageable_type: TABLES.NEWS}, function (err, images) {
                            if (err) {
                                return callback(err);
                            }

                            //expect(images.length).equal(0);

                            /*var imageUrl = getImageUrl(articleImage.name);

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