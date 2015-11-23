var express = require('express');
var newsRouter = express.Router();
var NewsHandler = require('../handlers/news');

module.exports = function (PostGre) {
    var newsHandler = new NewsHandler(PostGre);

    newsRouter.route('/').get(newsHandler.getNews);
    newsRouter.route('/static').get(newsHandler.getStaticNews);
    newsRouter.route('/').post(newsHandler.createArticle);

    newsRouter.route('/count').get(newsHandler.getNewsCount);

    newsRouter.route('/:id').get(newsHandler.getArticle);
    newsRouter.route('/:id').put(newsHandler.updateArticle);
    newsRouter.route('/:id').delete(newsHandler.removeArticle);

    return newsRouter;
};
