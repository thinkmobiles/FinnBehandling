var CONSTANTS = require('../constants/constants');
var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('async');
var logWriter = require('../helpers/logWriter')();
var Validation = require('../helpers/validation');



var news = function (PostGre) {

    var News = PostGre.Models[TABLES.NEWS];
    var self = this;

    this.getNewsByParams = function (options, callback) {

        if (+options && typeof +options === 'number') {

           getArticle(options, callback);

        } else if (typeof options === 'object'){

            getAllNews(options, callback);

        } else if (typeof options === 'null'){

            var error;
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            callback(error);
        }
    };

    function getArticle (newsId, callback){
        News
            .forge({id: newsId})
            .fetch()
            .asCallback(function (err, news){
                if(err){
                    return callback(err);
                }

                return callback(null, news);
            });
    }

    function getAllNews (options, callback){
        News
            .query(function (qb) {
                qb.limit(options.limit);
                if (options.page) {
                    qb.offset((options.page - 1) * options.limit);
                }
            })
            .fetchAll()
            .asCallback(function (err, news){
                if(err){
                    return callback(err);
                }

                return callback(null, news);
            });
    }

    this.checkCreateNewsOptions = new Validation.Check({
        subject: ['required', 'isString'],
        content: ['required', 'isString'],
        source: ['required', 'isString']

    });

    this.createArticle = function (options, callback){

        self.checkCreateNewsOptions.run(options, function (err, validOptions) {

            if (err) {
                return callback(err)
            }

            News
                .forge()
                .save(validOptions, {require: true})
                .asCallback(function (err, news){

                    if(err){

                        return callback(err);
                    }

                    return callback(null, news);
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

        self.checkUpdateNewsOptions.run(options, function (err, validOptions) {

            if (err) {
                return callback(err)
            }

            News
                .where({id: options.id})
                .save(validOptions, {method: 'update', require: true})
                .asCallback(function (err, news){

                    if(err){

                        return callback(err);
                    }

                    return callback(null, news);
                });
        });
    };

    this.deleteArticle = function (newsId, callback) {

        var error;

        if (!newsId) {
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return callback(error);
        }

        News
            .where({id: newsId})
            .destroy()
            .asCallback(function (err) {

                if (err) {
                    error = err || new Error(RESPONSES.REMOVING_ERROR);
                    error.status = 500;

                    return callback(error);
                }

                return callback();
            });
    };
};

module.exports = news;

