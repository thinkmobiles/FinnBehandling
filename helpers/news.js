var CONSTANTS = require('../constants/constants');
var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('async');
var logWriter = require('../helpers/logWriter')();
var Validation = require('../helpers/validation');



var news = function (PostGre) {

    var News = PostGre.Models[TABLES.NEWS];
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

        assert(callback);

        if (+options && typeof +options === 'number') {

           getArticle(options, callback);

        } else if (typeof options === 'object'){

            getAllNews(options, callback);

        } else if (typeof options === 'null'){

            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            callback(error);
        }
    };

    function getArticle (newsId, callback){
        News
            .forge({id: newsId})
            .fetch()
            .asCallback(callback);
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
            .asCallback(callback);
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
                .asCallback(callback);
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
                .asCallback(callback);
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

