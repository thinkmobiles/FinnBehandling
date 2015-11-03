var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  WebRecommendations management module
 * @module webRecommendations
 *
 */

var WebRecommendations = function (PostGre) {

    var WebRecommendations = PostGre.Models[TABLES.WEB_RECOMMENDATIONS];

    this.getWebRecommendations = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all webRecommendations_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations
         *
         * @example Response example:
         *
         * [
         *   {
         *      "id": 4,
         *      "name": "Clinic research2",
         *      "link": "www.example.test",
         *      "created_at": "2015-09-29T13:39:44.644Z",
         *      "updated_at": "2015-09-29T13:39:44.644Z"
         *  },
         *  {
         *     "id": 3,
         *     "name": "Clinic research updated",
         *     "link": "www.example.test",
         *     "created_at": "2015-09-29T13:39:39.870Z",
         *     "updated_at": "2015-09-29T13:48:39.981Z"
         *  }
         * ]
         *
         * @method getWebRecommendations
         * @instance
         */


        var limit = req.query.limit;
        var page = req.query.page;

        var limitIsValid = limit && !isNaN(limit) && limit > 0;
        var offsetIsValid = page && !isNaN(page) && page > 1;

        WebRecommendations
            .query(function (qb) {
                qb.limit( limitIsValid ? limit : 25 );
                qb.offset( offsetIsValid ? (page - 1) * limit : 0 );
            })
            .fetchAll()
            .asCallback(function (err, webRecommendations) {

                if (err) {
                    return next(err);
                }

                res.status(200).send(webRecommendations);
            });
    };

    this.createRecommendation = function (req, res, next){

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows create _recommendation_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations
         *
         * @example Response example:
         *
         * {
         *     "name": "Clinic research",
         *     "link": "www.example.test"
         * }
         * @param {string} name - name of new recommendation
         * @param {string} link - link of new recommendation
         * @method createRecommendation
         * @instance
         */

        var options = req.body;

        WebRecommendations.createValid(options, function(err, result){

            if (err) {
                return next(err);
            }

            res.status(201).send({
                success: RESPONSES.WAS_CREATED,
                article: result
            });
        });
    };

    this.getRecommendation = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one recommendation_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations/:id
         *
         * @example Response example:
         *
         * {
         *       "id": 3,
         *       "name": "Clinic research updated",
         *       "link": "www.example.test",
         *       "created_at": "2015-09-29T13:39:39.870Z",
         *       "updated_at": "2015-09-29T13:48:39.981Z"
         * }
         *
         * @param {number} id - id of recommendation
         * @method getRecommendation
         * @instance
         */

        var recommendationId = req.params.id;

        WebRecommendations
            .forge({id: recommendationId})
            .fetch({
                require: true
            })
            .asCallback(function(err, recommendation){

                if (err) {
                    return next(err);
                }

                res.status(200).send(recommendation);
            });
    };

    this.updateRecommendation = function (req, res, next){

        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update _recommendation_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations/:id
         *
         * @example Response example:
         *
         * {
         *     "name": "Clinic research",
         *     "link": "www.example.test"
         * }
         * @param {number} id - id of recommendation
         * @param {string} name - name of recommendation (optional)
         * @param {string} link - link of recommendation (optional)
         * @method updateRecommendation
         * @instance
         */

        var newsId = req.params.id;
        var options = req.body;

        options.id = newsId;

        WebRecommendations.updateValid(options, function(err, result){

            if (err) {
                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                article: result
            });
        });
    };

    this.removeRecommendation = function (req, res, next){

        /**
         * __Type__ `DELETE`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows delete _recommendation_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations/:id
         *
         * @example Response example:
         *
         * {
         *   "success": "was removed successfully"
         * }
         *
         * @param {number} id - id of recommendation
         * @method removeRecommendation
         * @instance
         */

        var recommendationId = req.params.id;

        WebRecommendations
            .where({id: recommendationId})
            .destroy()
            .asCallback(function(err, recommendation){

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    success: RESPONSES.REMOVE_SUCCESSFULY
                });
            });
    };

    this.getRecommendationsCount = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _recommendations count_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/webRecommendations/count
         *
         * @example Response example:
         *
         *       {
         *          "count": 3
         *      }
         *
         * @method getRecommendationsCount
         * @instance
         */

        PostGre.knex(TABLES.WEB_RECOMMENDATIONS)
            .count()
            .asCallback(function (err, queryResult) {

                if (err) {
                    return next(err);
                }

                var count = queryResult && queryResult.length ? +queryResult[0].count : 0;

                res.status(200).send({count: count});
            });
    };

};

module.exports = WebRecommendations;