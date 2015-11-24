var express = require('express');
var staticNewsRouter = express.Router();
var staticNewsHandler = require('../handlers/staticNews');

module.exports = function (PostGre) {
    var newsHandler = new staticNewsHandler(PostGre);

    staticNewsRouter.route('/').get(newsHandler.getStaticNews);
    staticNewsRouter.route('/').post(newsHandler.createArticle);

    //newsRouter.route('/count').get(newsHandler.getStaticNewsCount);

    staticNewsRouter.route('/:position').get(newsHandler.getArticle);
    staticNewsRouter.route('/:id').put(newsHandler.updateArticle);
    staticNewsRouter.route('/:id').delete(newsHandler.removeArticle);

    return staticNewsRouter;
};
