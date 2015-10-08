var express = require('express');
var staticDataRouter = express.Router();
var StaticDataHandler = require('../handlers/staticData');

module.exports = function (PostGre) {
    var staticDataHandler = new StaticDataHandler(PostGre);

    staticDataRouter.route('/')
        .get(staticDataHandler.getStaticData)
        .put(staticDataHandler.updateStaticData);

    return staticDataRouter;
};
