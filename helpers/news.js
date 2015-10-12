var CONSTANTS = require('../constants/constants');
var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('async');
var logWriter = require('../helpers/logWriter')();
var Validation = require('../helpers/validation');



var news = function (PostGre) {

    var News = PostGre.Models[TABLES.NEWS];

    var Image = require('./images');
    var image = new Image(PostGre);

    var self = this;

    function assert(fn) {
        var error;

        if (typeof fn !== 'function') {
            error = new Error(typeof fn + ' is not a function');
            throw error;
        }
    }

    this.getNewsByParams = function (options, callback) {

        var error;
        var errorMessage;

        assert(callback);

        if (+options && typeof +options === 'number') {

           getArticle(options, callback);

        } else if (typeof options === 'object') {

            getAllNews(options, callback);

        } else {
            errorMessage = !options ? RESPONSES.NOT_ENOUGH_PARAMETERS : RESPONSES.INVALID_PARAMETERS;

            error = new Error(errorMessage);
            error.status = 400;

            callback(error);
        }
    };

    function getArticle (newsId, callback){
        News
            .forge({id: newsId})
            .fetch({
                withRelated: [
                    'image'
                ],
                require: true
            })
            .asCallback(callback);
    }

    function getAllNews (options, callback){
        News
            .query(function (qb) {
                qb.limit(options.limit);
                qb.offset(options.offset);
            })
            .fetchAll({
                withRelated: [
                    'image'
                ]
            })
            .asCallback(callback);
    }

    this.getNewsCount = function (callback){

        assert(callback);

        PostGre.knex(TABLES.NEWS)
            .count()
            .asCallback(function (err, queryResult) {
                var  clientsCount;

                if (err) {
                    return callback(err);
                }

                clientsCount = queryResult && queryResult.length ? +queryResult[0].count : 0;

                callback(null, clientsCount);
            });
    }

    this.checkCreateNewsOptions = new Validation.Check({
        subject: ['required', 'isString'],
        content: ['required', 'isString'],
        source: ['required', 'isString']

    });

    this.createArticle = function (options, callback){

        assert(callback);

        self.checkCreateNewsOptions.run(options, function (err, validOptions) {

            if (err) {
                return callback(err)
            }

            News
                .forge()
                .save(validOptions, {require: true})
                .asCallback(function (err, result) {
                    var  imageParams;

                    if (err) {
                        return callback(err);
                    }

                    if (options.image) {

                        imageParams = {
                            imageUrl: options.image,
                            imageable_id: result.id,
                            imageable_type: TABLES.NEWS,
                            imageable_field: 'image'
                        };

                        image.newImage(imageParams, function () {

                            callback(null, result);
                        });

                    } else {

                        callback(null, result);
                    }
                });
        });
    };

    this.checkUpdateNewsOptions = new Validation.Check({
        id: ['required', 'isInt'],
        subject: ['required', 'isString'],
        content: ['required', 'isString'],
        source: ['required', 'isString']

    });

    this.updateArticle = function (options, callback){

        assert(callback);

        self.checkUpdateNewsOptions.run(options, function (err, validOptions) {

            if (err) {
                return callback(err)
            }

            News
                .where({id: options.id})
                .save(validOptions, {method: 'update', require: true})
                .asCallback(function (err, result) {
                    var  imageParams;

                    if (err) {
                        return callback(err);
                    }

                    if (options.image) {

                        imageParams = {
                            imageUrl: options.image,
                            imageable_id: result.id,
                            imageable_type: TABLES.NEWS,
                            imageable_field: 'image'
                        };

                        image.updateOrCreateImageByClientProfileId(imageParams, function () {

                            callback(null, result);
                        });

                    } else {

                        callback(null, result);
                    }
                });
        });
    };

    this.deleteArticle = function (newsId, callback) {

        var error;

        assert(callback);

        if (!newsId) {
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return callback(error);
        }

        News
            .where({id: newsId})
            .destroy()
            .asCallback(callback);
    };
};

module.exports = news;

