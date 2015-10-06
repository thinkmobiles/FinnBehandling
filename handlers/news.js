var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  News management module
 * @module news
 *
 */

var News = function (PostGre) {

    var NewsHelper = require('../helpers/news.js');
    var newsHelper = new NewsHelper(PostGre);

    this.getArticle = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one article_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/news/:id
         *
         * @example Response example:
         *
         * {
         *       "id": 3,
         *       "subject": "Clinic research updated",
         *       "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *       "source": "Newspaper updated",
         *       "created_at": "2015-09-29T13:39:39.870Z",
         *       "updated_at": "2015-09-29T13:48:39.981Z"
         * }
         *
         * @param {number} id - id of article
         * @method getArticle
         * @instance
         */

       var newsId = req.params.id;

        newsHelper.getNewsByParams (newsId, function(err, news){
          if(err){

              return next(err);
          }

          res.status(200).send(news);
      });
    };

    this.getNews = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all news_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/news
         *
         * @example Response example:
         *
         * [
         *   {
         *      "id": 4,
         *      "subject": "Clinic research2",
         *      "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *      "source": "Newspaper 2",
         *      "created_at": "2015-09-29T13:39:44.644Z",
         *      "updated_at": "2015-09-29T13:39:44.644Z"
         *  },
         *  {
         *     "id": 3,
         *     "subject": "Clinic research updated",
         *     "content": "Lorem ipsum dolor si Lorem ipsum dolor si",
         *     "source": "Newspaper updated",
         *     "created_at": "2015-09-29T13:39:39.870Z",
         *     "updated_at": "2015-09-29T13:48:39.981Z"
         *  }
         * ]
         *
         * @method getNews
         * @instance
         */

        var options = {};
        var limit = req.query.limit;
        var page = req.query.page;

        var limitIsValid = limit && !isNaN(limit) && limit > 0;
        var offsetIsValid = page && !isNaN(page) && page > 1;

        options.limit = limitIsValid ? limit : 25;
        options.offset = offsetIsValid ? (page - 1) * options.limit : 0;

        newsHelper.getNewsByParams(options, function (err, news) {
            if (err) {

                return next(err);
            }

            res.status(200).send(news);
        });
    };

    this.getNewsCount = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _news count_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/news/count
         *
         * @example Response example:
         *
         *       {
         *          "count": 3
         *      }
         *
         * @method getNewsCount
         * @instance
         */

        newsHelper.getNewsCount(function (err, count) {
            if (err) {

                return next(err);
            }

            res.status(200).send({count: count});
        });
    };

    this.createArticle = function (req, res, next){

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows create _article_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/news
         *
         * @example Response example:
         *
         * {
         *     "subject": "Clinic research",
         *     "content": "Lorem ipsum dolor si",
         *     "source": "Newspaper"
         * }
         * @param {string} subject - subject of new article
         * @param {string} content - content of new article
         * @param {string} source - source of new article
         * @method createArticle
         * @instance
         */

        var options = req.body;

        newsHelper.createArticle(options, function(err, news){

            if(err){

                return next(err);
            }

            res.status(201).send({
                success: RESPONSES.WAS_CREATED,
                article: news
            });
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
         *         http://192.168.88.250:8787/news/:id
         *
         * @example Response example:
         *
         * {
         *     "subject": "Clinic research",
         *     "content": "Lorem ipsum dolor si",
         *     "source": "Newspaper"
         * }
         * @param {number} id - id of article
         * @param {string} subject - subject of article (optional)
         * @param {string} content - content of article (optional)
         * @param {string} source - source of article (optional)
         * @method updateArticle
         * @instance
         */

        var newsId = req.params.id;
        var options = req.body;

        options.id = newsId;

        newsHelper.updateArticle(options, function(err, news){

            if(err){

                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                article: news
            });
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
         *         http://192.168.88.250:8787/news/:id
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

        var newsId = req.params.id;

        newsHelper.deleteArticle(newsId, function(err, news){

            if(err){

                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.REMOVE_SUCCESSFULY
            });
        });
    };
};

module.exports = News;
