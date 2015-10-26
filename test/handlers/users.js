'use strict';
var request = require('supertest');
var expect = require("chai").expect;
var async = require('async');
var RESPONSES = require('../../constants/responseMessages');
var Config = require('../config');
var Helpers = require('../helpers/general');
var files = require('./../db/base64Fixtures/files');
var TABLES = require('../../constants/tables');

describe('Users', function () {
    var conf = new Config();
    var app = conf.app;
    var PostGre = app.get('PostGre');
    var helpers = new Helpers(PostGre.knex);
    var factory = require('../db/factories')(PostGre);
    var userId;
    var updatingUserId;
    var encryptedPass = 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f';
    var encryptedUpdatedPass = 'e24df920078c3dd4e7e8d2442f00e5c9ab2a231bb3918d65cc50906e49ecaef4';

    var url = conf.host;
    var agent = request.agent(url);


    before(function (done) {
        console.log('>>> before');

        factory.createMany('user', 5, function (err, users) {
            if (err) {
                return done(err);
            }

            userId = users[0].id;
            updatingUserId = users[1].id;

            done();
        });
    });

    it('should create a new user', function (done) {
        
        var data = {
            name: 'John Smith',
            email: 'john@mail.com',
            password: '12345678',
            pass_confirm: '12345678',
            google_id: '1',
            facebook_id: '2',
            twitter_id: '3',
            role: 'admin'
        };

        agent
            .post('/user/signUp')
            .send(data)
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.WAS_CREATED);


                helpers.getOneJustCreated(TABLES.USERS, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    expect(user).to.exist;
                    expect(user).to.be.instanceOf(Object);
                    expect(user).to.have.property('name');
                    expect(user.name).equal(data.name);
                    expect(user).to.have.property('email');
                    expect(user.email).equal(data.email);
                    expect(user).to.have.property('password');
                    expect(user.password).equal(encryptedPass);
                    expect(user).to.have.property('google_id');
                    expect(user.google_id).equal(data.google_id);
                    expect(user).to.have.property('facebook_id');
                    expect(user.facebook_id).equal(data.facebook_id);
                    expect(user).to.have.property('twitter_id');
                    expect(user.twitter_id).equal(data.twitter_id);
                    expect(user).to.have.property('role');
                    expect(user.role).equal(data.role);

                    done();
                });
            });
    });

    it('should sigIn user', function (done) {

        var sigInData = {
            email: 'john@mail.com',
            password: '12345678'
        };

        agent
            .post('/user/signIn')
            .send(sigInData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.SUCCESSFUL_LOGIN);

                done();
            });
    });

    it('should signOut user', function (done) {
        agent
            .get('/user/signOut')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.SUCCESSFUL_LOGOUT);

                done();
            });
    });

    it('should get one user', function (done) {
        agent
            .get('/user/' + userId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var user = res.body;

                expect(user).to.exist;
                expect(user).to.be.instanceOf(Object);
                expect(user).to.have.property('name');
                expect(user).to.have.property('email');
                expect(user).to.have.property('password');
                expect(user).to.have.property('google_id');
                expect(user).to.have.property('facebook_id');
                expect(user).to.have.property('twitter_id');
                expect(user).to.have.property('role');

                done();
            });
    });


    it('should get all users', function (done) {
        agent
            .get('/user')
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var users = res.body;

                expect(users).to.be.not.empty;
                expect(users).to.be.instanceOf(Array);
                expect(users.length).least(4);
                expect(users[0]).to.be.instanceOf(Object);
                expect(users[0]).to.have.property('name');
                expect(users[0]).to.have.property('email');
                expect(users[0]).to.have.property('password');
                expect(users[0]).to.have.property('google_id');
                expect(users[0]).to.have.property('facebook_id');
                expect(users[0]).to.have.property('twitter_id');
                expect(users[0]).to.have.property('role');

                done();
            });
    });

    it('should get users count', function (done) {
        agent
            .get('/user/count')
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

    it('should update user', function (done) {
        var updateData = {
            name: 'Adam Smith',
            email: 'adam@mail.com',
            password: '87654321',
            pass_confirm: '87654321',
            google_id: '3',
            facebook_id: '2',
            twitter_id: '1',
            role: 'user'

        };

        agent
            .put('/user/' + updatingUserId)
            .send(updateData)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                var success = res.body.success;

                expect(success).equal(RESPONSES.UPDATED_SUCCESS);


                helpers.getOne(TABLES.USERS, updatingUserId, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    expect(user).to.exist;
                    expect(user).to.be.instanceOf(Object);
                    expect(user).to.have.property('name');
                    expect(user.name).equal(updateData.name);
                    expect(user).to.have.property('email');
                    expect(user.email).equal(updateData.email);
                    expect(user).to.have.property('password');
                    expect(user.password).equal(encryptedUpdatedPass);
                    expect(user).to.have.property('google_id');
                    expect(user.google_id).equal(updateData.google_id);
                    expect(user).to.have.property('facebook_id');
                    expect(user.facebook_id).equal(updateData.facebook_id);
                    expect(user).to.have.property('twitter_id');
                    expect(user.twitter_id).equal(updateData.twitter_id);
                    expect(user).to.have.property('role');
                    expect(user.role).equal(updateData.role);

                    done();
                });
            });
    });


    it('should delete user', function(done) {
        agent
            .delete('/user/' + userId)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                expect(res.body.success).equal(RESPONSES.REMOVE_SUCCESSFULY);

                helpers.getOne(TABLES.USERS, userId, function (err, user) {
                    if (err) {
                        return done(err);
                    }

                    expect(user).not.to.exist;

                    done();
                });

            });
    });
});