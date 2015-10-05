var express = require('express');
var newsRouter = express.Router();
var NewsHandler = require('../handlers/news');

module.exports = function (PostGre) {
    var newsHandler = new NewsHandler(PostGre);

    newsRouter.route('/')
        .get(newsHandler.getNews)
        .post(newsHandler.createArticle);

    newsRouter.route('/count')
        .get(newsHandler.getNewsCount);

    newsRouter.route('/:id')
        .get(newsHandler.getArticle)
        .put(newsHandler.updateArticle)
        .delete(newsHandler.removeArticle);

    return newsRouter;
};
