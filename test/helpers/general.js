var TABLES = require('../../constants/tables');
var crypto = require('crypto');
var async = require('async');


module.exports = function (knex) {
    var self = this;

    this.getOne = function (tableName, id, callback) {
        var callbackIsFunction = callback && (typeof callback === 'function');

        knex(tableName)
            .where({id: id})
            .then(function (result) {
                if (callbackIsFunction) {
                    callback(null, result[0]);
                }
            })
            .catch(function (err) {
                console.warn(err);
                if (callbackIsFunction) {
                    callback(err);
                }
            });
    };

    this.getOneJustCreated = function (tableName, callback) {
        var callbackIsFunction = callback && (typeof callback === 'function');

        knex(tableName)
            .orderBy('created_at', 'desc')
            .whereNotNull('created_at')
            .limit(1)
            .then(function (result) {
                if (callbackIsFunction) {
                    callback(null, result[0]);
                }
            })
            .catch(function (err) {
                console.warn(err);
                if (callbackIsFunction) {
                    callback(err);
                }
            });
    };

    this.getByParams = function (tableName, params,  callback) {
        var callbackIsFunction = callback && (typeof callback === 'function');

        knex(tableName)
            .where(params)
            .then(function (result) {
                if (callbackIsFunction) {
                    callback(null, result);
                }
            })
            .catch(function (err) {
                console.warn(err);
                if (callbackIsFunction) {
                    callback(err);
                }
            });
    };
};