var CONSTANTS = require('../constants/constants');
var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('async');
var logWriter = require('../helpers/logWriter')();
var Validation = require('../helpers/validation');



var staticData = function (PostGre) {

    var StaticData = PostGre.Models[TABLES.STATIC_DATA];
    var self = this;

    function assert(fn) {
        var error;

        if (typeof fn !== 'function') {
            error = new Error(typeof fn + ' is not a function');
            throw error;
        }
    }

    this.getStaticData = function (staticDataId, callback) {

        var error;

        assert(callback);

        if (!staticDataId) {

            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return callback(error);
        }

        StaticData
            .forge({id: staticDataId})
            .fetch()
            .asCallback(callback);
    };

    this.checkUpdateStaticDataOptions = new Validation.Check({
        text: ['required', 'isString']
    });

    this.updateArticle = function (options, callback){

        assert(callback);

        self.checkUpdateStaticDataOptions.run(options, function (err, validOptions) {

            if (err) {
                return callback(err)
            }

            StaticData
                .where({id: options.id})
                .save(validOptions, {method: 'update', require: true})
                .asCallback(callback);
        });
    };
};

module.exports = staticData;

