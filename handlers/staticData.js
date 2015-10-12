var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  News management module
 * @module news
 *
 */

var StaticData = function (PostGre) {

    var StaticDataHelper = require('../helpers/staticData.js');
    var staticDataHelper = new StaticDataHelper(PostGre);

    this.getStaticData = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one static_ entry
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticData
         *
         * @example Response example:
         *
         * {
         *       "id": 1,
         *       "text": "Some text"
         * }
         *
         * @param {number} id - id of article
         * @method getStaticData
         * @instance
         */

        var staticId = 1;

        staticDataHelper.getStaticData (staticId, function(err, result){
            if(err){

                return next(err);
            }

            res.status(200).send(result);
        });
    };

    this.updateStaticData = function (req, res, next){

        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update _static_data_entries_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticData
         *
         * @example Response example:
         *
         * {
         *     "text": "Some updated text"
         * }
         * @param {number} id - id of article
         * @param {string} text - text for static data entry
         * @method updateStaticData
         * @instance
         */

        var newsId = 1;
        var options = req.body;

        options.id = newsId;

        staticDataHelper.updateArticle(options, function(err, result){

            if(err){

                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                staticData: result
            });
        });
    };
};

module.exports = StaticData;
