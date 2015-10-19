var express = require('express');
var advertisementRouter = express.Router();
var AdvertisementHandler = require('../handlers/advertisement');

module.exports = function (PostGre) {
    var advertisementHandler = new AdvertisementHandler(PostGre);

    advertisementRouter.route('/').get(advertisementHandler.getAdvertisements);
    advertisementRouter.route('/').post(advertisementHandler.createAdvertisement);

    advertisementRouter.route('/count').get(advertisementHandler.getAdvertisementsCount);

    advertisementRouter.route('/:id').get(advertisementHandler.getOneAdvertisement);
    advertisementRouter.route('/:id').put(advertisementHandler.updateAdvertisement);
    advertisementRouter.route('/:id').delete(advertisementHandler.removeAdvertisement);

    return advertisementRouter;
};

