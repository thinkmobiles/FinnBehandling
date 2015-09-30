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

describe('News', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);

    var url = conf.host;
    var agent = request.agent(url);

    var articleId;

    before(function (done) {
        console.log('>>> before');
        done();
    });

    it('should create a new article', function (done) {
        var data = {
            subject: 'Clinic research',
            content: 'Lorem ipsum dolor si',
            source: 'Newspaper'
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

                helpers.getOneJustCreated(TABLES.NEWS, function (err, article) {
                    if (err) {
                        return done(err);
                    }

                    expect(article).to.exist;
                    expect(article).to.be.instanceOf(Object);
                    expect(article).to.have.property('subject');
                    expect(article.subject).equal('Clinic research');
                    expect(article).to.have.property('content');
                    expect(article.content).equal('Lorem ipsum dolor si');
                    expect(article).to.have.property('source');
                    expect(article.source).equal('Newspaper');

                    articleId = article.id;

                    done();
                });

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

                    expect(article).to.exist;
                    expect(article).to.be.instanceOf(Object);
                    expect(article).to.have.property('subject');
                    expect(article.subject).equal('Clinic research');
                    expect(article).to.have.property('content');
                    expect(article.content).equal('Lorem ipsum dolor si');
                    expect(article).to.have.property('source');
                    expect(article.source).equal('Newspaper');

                    done();

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
                expect(article[0]).to.be.instanceOf(Object);
                expect(article[0]).to.have.property('subject');
                expect(article[0]).to.have.property('content');
                expect(article[0]).to.have.property('source');

                done();

            });
    });

    it('should update article', function (done) {
        var data = {
            subject: 'Updated research',
            content: 'Lorem ipsum dolor si',
            source: 'Updated Newspaper'
        };

        agent
            .put('/news/' + articleId)
            .send(data)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_SUCCESS);

                helpers.getOne(TABLES.NEWS, articleId, function (err, article) {
                    if (err) {
                        return done(err);
                    }

                    expect(article).to.exist;
                    expect(article).to.be.instanceOf(Object);
                    expect(article).to.have.property('subject');
                    expect(article.subject).equal('Updated research');
                    expect(article).to.have.property('content');
                    expect(article.content).equal('Lorem ipsum dolor si');
                    expect(article).to.have.property('source');
                    expect(article.source).equal('Updated Newspaper');

                    articleId = article.id;

                    done();
                });

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
                done();
            });
    });

});