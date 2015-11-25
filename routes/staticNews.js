var express = require('express');
var staticNewsRouter = express.Router();
var StaticNewsHandler = require('../handlers/staticNews');

module.exports = function (PostGre) {
    var newsHandler = new StaticNewsHandler(PostGre);

    staticNewsRouter.route('/').get(newsHandler.getLastStaticNews);
    staticNewsRouter.route('/').post(newsHandler.createArticle);

    staticNewsRouter.route('/:position').get(newsHandler.getArticlesByPosition);
    staticNewsRouter.route('/:id').put(newsHandler.updateArticle);
    staticNewsRouter.route('/:id').delete(newsHandler.removeArticle);

    return staticNewsRouter;
};
