var express = require('express');
var webRecommendationsRouter = express.Router();
var WebRecommendationsHandler = require('../handlers/webRecommendations');

module.exports = function (PostGre) {

    var webRecommendationsHandler = new WebRecommendationsHandler(PostGre);

    webRecommendationsRouter.route('/').get(webRecommendationsHandler.getWebRecommendations);
    webRecommendationsRouter.route('/').post(webRecommendationsHandler.createRecommendation);

    webRecommendationsRouter.route('/count').get(webRecommendationsHandler.getRecommendationsCount);

    webRecommendationsRouter.route('/:id').get(webRecommendationsHandler.getRecommendation);
    webRecommendationsRouter.route('/:id').put(webRecommendationsHandler.updateRecommendation);
    webRecommendationsRouter.route('/:id').delete(webRecommendationsHandler.removeRecommendation);

    return webRecommendationsRouter;
};
