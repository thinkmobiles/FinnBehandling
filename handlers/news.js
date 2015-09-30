var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

//helpers


var News;

News = function (PostGre) {

    var NewsHelper = require('../helpers/news.js');
    var newsHelper = new NewsHelper(PostGre);

    this.getArticle = function (req, res, next){

       var newsId = req.params.id;

        newsHelper.getNewsByParams (newsId, function(err, news){
          if(err){

              return next(err);
          }

          res.status(200).send(news);
      });
    };

    this.getNews = function (req, res, next) {

        var options = {
            page: req.query.page || 1,
            count: req.query.count || 25
        };

        newsHelper.getNewsByParams(options, function (err, news) {
            if (err) {

                return next(err);
            }

            res.status(200).send(news);
        });
    };

    this.createArticle = function (req, res, next){

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

