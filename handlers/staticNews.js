var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

/**
 * @description  StaticNews management module
 * @module staticNews
 *
 */

var StaticNews = function (PostGre) {

    var StaticNews =  PostGre.Models[TABLES.STATIC_NEWS];

    var Image = require('../helpers/images');
    var image = new Image(PostGre);

    this.getArticlesByPosition = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one article_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticNews/:position
         *
         * @example Response example:
         *
         * [
         *  {
         *          "id": 3,
         *          "subject": "Clinic research updated",
         *          "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *          "source": "Newspaper updated",
         *          "position": "left",
         *          "created_at": "2015-09-29T13:39:39.870Z",
         *          "updated_at": "2015-09-29T13:48:39.981Z"
         *  },
         *  {
         *      "id": 0,
         *      "subject": "Clinic research2",
         *      "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *      "source": "Newspaper 2",
         *      "position": "left",
         *      "created_at": "2015-09-29T13:39:44.644Z",
         *      "updated_at": "2015-09-29T13:39:44.644Z"
         *  }
         * ]
         *
         * @param {number} id - id of article
         * @param {string} subject - subject of article
         * @param {string} content - content of article
         * @param {string} source - source of article
         * @param {string} position - position of article
         * @method getArticlesByPosition
         * @instance
         */

        var position = req.params.position;
        var lastDataId = req.query.staticNewId;

        StaticNews
            .query(function (qb) {

                qb
                    .select('id', 'subject', 'content', 'position', 'created_at')
                    .from(TABLES.STATIC_NEWS)
                    .where(TABLES.STATIC_NEWS + '.position', position)
                    .andWhereNot('id', lastDataId)
                    .orderBy('created_at', 'desc');
            })
            .fetchAll({
                withRelated: [
                    'image'
                ]
            })
            .asCallback(function (err, staticNews) {

                if (err) {
                    return next(err);
                }

                res.status(200).send(staticNews);
            });
    };

    this.getLastStaticNews = function (req, res, next) {

        /**
         * __Type__ 'GET'
         * __Content-Type__ 'application/json'
         *
         * This __method__ allows get _all static news_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticNews
         *
         * @example Response example:
         *
         * [
         *   {
         *      "id": 0,
         *      "subject": "Clinic research2",
         *      "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *      "source": "Newspaper 2",
         *      "position": "left",
         *      "created_at": "2015-09-29T13:39:44.644Z",
         *      "updated_at": "2015-09-29T13:39:44.644Z"
         *  },
         *  {
         *     "id": 1,
         *     "subject": "Clinic research updated",
         *     "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *     "source": "Newspaper updated",
         *     "position": "right",
         *     "created_at": "2015-09-29T13:39:39.870Z",
         *     "updated_at": "2015-09-29T13:48:39.981Z"
         *  }
         * ]
         *
         * @method getLastStaticNews
         * @instance
         */

        StaticNews
            .query(function (qb) {

                qb
                    .select('id', 'subject', 'content', 'position', 'created_at', 'rank')
                    .from(
                        PostGre.knex.raw('(SELECT id, subject, content, position, created_at, rank()' +
                            'OVER (PARTITION BY position ORDER BY created_at DESC ) FROM tb_static_news) AS arr_data ')
                    )
                    .where('rank', 1)
                    .orderBy(PostGre.knex.raw('(-2)^(7-length(position))'));

            })
            .fetchAll({
                withRelated: [
                    'image'
                ]
            })
            .asCallback(function (err, staticNews) {

                if (err) {
                    return next(err);
                }

                res.status(200).send(staticNews);
            });
    };

    this.createArticle = function (req, res, next) {

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows create _staticNews_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticNews
         *
         * @example Response example:
         *
         * {
         *      "success": "Was created successfully",
         *      "article": {
         *          "subject": "Clinic research",
         *          "content": "Lorem ipsum dolor si",
         *          "source": "Newspaper",
         *          "position": "left",
         *          "updated_at": "2015-11-25T11:23:49.117Z",
         *          "created_at": "2015-11-25T11:23:49.117Z",
         *          "id": 5
         *      }
         * }
         *
         * @param {string} subject - subject of new article
         * @param {string} content - content of new article
         * @param {string} source - source of new article
         * @param {string} position - position of new article
         * @method createArticle
         * @instance
         */


        var options = req.body;

        StaticNews.createValid(options, function (err, result) {

            if (err) {
                return next(err);
            }

            if (options.image) {

                var imageParams = {
                    imageUrl: options.image,
                    imageable_id: result.id,
                    imageable_type: TABLES.STATIC_NEWS,
                    imageable_field: 'image'
                };

                image.newImage(imageParams, function () {

                    res.status(201).send({
                        success: RESPONSES.WAS_CREATED,
                        article: result
                    });
                });
            } else {

                res.status(201).send({
                    success: RESPONSES.WAS_CREATED,
                    article: result
                });
            }
        });
    };

    this.updateArticle = function (req, res, next){

        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update _article_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticNewsId/:id
         *
         * @example Response example:
         *
         * {
         *      "success": "was updated successfully",
         *      "article": {
         *          "id": 5,
         *          "subject": "Clinic",
         *          "content": "Lorem ipsum dolor si",
         *          "source": "Newspaper",
         *          "position": "left",
         *          "updated_at": "2015-11-25T11:34:57.061Z"
         *      }
         * }
         *
         * @param {number} id - id of article
         * @param {string} subject - subject of article (optional)
         * @param {string} content - content of article (optional)
         * @param {string} source - source of article (optional)
         * @param {string} position - position of article (optional)
         * @method updateArticle
         * @instance
         */

        var staticNewsId = req.params.id;
        var options = req.body;

        options.id = staticNewsId;

        StaticNews.updateValid(options, function(err, result){

            if (err) {
                return next(err);
            }

            if (options.image && typeof options.image === 'string') {

                var imageParams = {
                    imageUrl: options.image,
                    imageable_id: result.id,
                    imageable_type: TABLES.NEWS,
                    imageable_field: 'image'
                };

                image.updateOrCreateImageByClientProfileId(imageParams, function () {

                    res.status(200).send({
                        success: RESPONSES.UPDATED_SUCCESS,
                        article: result
                    });
                });
            } else {

                res.status(200).send({
                    success: RESPONSES.UPDATED_SUCCESS,
                    article: result
                });
            }
        });
    };

    this.removeArticle = function (req, res, next){

        /**
         * __Type__ `DELETE`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows delete _article_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/staticNews/:id
         *
         * @example Response example:
         *
         * {
         *   "success": "was removed successfully"
         * }
         *
         * @param {number} id - id of article
         * @method removeArticle
         * @instance
         */

        var staticNewsId = req.params.id;

        StaticNews
            .where({id: staticNewsId})
            .destroy()
            .asCallback(function(err, staticNews){

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    success: RESPONSES.REMOVE_SUCCESSFULY
                });
            });
    };
};

module.exports = StaticNews;