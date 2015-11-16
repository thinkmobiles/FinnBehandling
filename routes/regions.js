var express = require('express');
var regionsRouter = express.Router();
var RegionsHandler = require('../handlers/regions');

module.exports = function (PostGre) {
    var regionsHandler = new RegionsHandler(PostGre);

    regionsRouter.route('/fylkes').get(regionsHandler.getFylkes);
    regionsRouter.route('/updateDB').post(regionsHandler.updateRegionsDB);

    return regionsRouter;
};