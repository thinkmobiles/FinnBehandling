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

describe('StaticNews', function () {
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

        factory.createMany('static_news_article', 4, function (err, news) {
            if (err) {
                return done(err);
            }


            done();

        });
    });
it('', function (done) {
    done();
});
   /* it('should create a new article', function (done) {
        var data = {
            subject: 'Clinic research',
            content: 'Lorem ipsum dolor si',
            source: 'Newspaper',
            position: 'left'/!*,
            image: images[TABLES.NEWS][0]*!/
        };

        agent
            .post('/staticNews')
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

                        helpers.getOneJustCreated(TABLES.STATIC_NEWS, function (err, article) {
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
    });*/
});