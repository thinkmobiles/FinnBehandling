var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

//helpers

/**
 * @description  Advertisement management module
 * @module advertisement
 *
 */

var Advertisement = function (PostGre) {

    var Advertisement = PostGre.Models[TABLES.ADVERTISEMENT];
    var Image = require('../helpers/images');
    var image = new Image(PostGre);

    this.getOneAdvertisement = function (req, res, next){

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _one advertisement_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement/:id
         *
         * @example Response example:
         *
         * {
         *       "id": 3,
         *       "text": "Clinic research updated"
         * }
         *
         * @param {number} id - id of article
         * @method getOneAdvertisement
         * @instance
         */

        var advertisementId = req.params.id;
        var error;

        if(!advertisementId){
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        Advertisement
            .forge({id: advertisementId})
            .fetch({
                withRelated: [
                    'image'
                ]
            })
            .asCallback(function(err, advertisement){

                if (err) {
                    return next(err);
                }

                res.status(200).send(advertisement);
            });
    };

    this.getAdvertisements = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _all advertisements_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement
         *
         * @example Response example:
         *
         * [
         *   {
         *      "id": 4,
         *      "text": "Clinic research2"
         *  },
         *  {
         *     "id": 3,
         *     "text": "Clinic research updated"
         *  }
         * ]
         *
         * @method getAdvertisements
         * @instance
         */

        var limit = req.query.limit;
        var page = req.query.page;

        var limitIsValid = limit && !isNaN(limit) && limit > 0;
        var offsetIsValid = page && !isNaN(page) && page > 1;

        Advertisement
            .query(function (qb) {
                qb.limit( limitIsValid ? limit : 25 );
                qb.offset( offsetIsValid ? (page - 1) * limit : 0 );
            })
            .fetchAll({
                withRelated: [
                    'image'
                ]
            })
            .asCallback(function (err, advertisements) {

                if (err) {
                    return next(err);
                }

                res.status(200).send(advertisements);
            });
    };

    this.getAdvertisementsCount = function (req, res, next) {

        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get _advertisements count_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement/count
         *
         * @example Response example:
         *
         *       {
         *          "count": 3
         *      }
         *
         * @method getAdvertisementsCount
         * @instance
         */

        PostGre.knex(TABLES.ADVERTISEMENT)
            .count()
            .asCallback(function (err, queryResult) {

                if (err) {
                    return next(err);
                }

                var count = queryResult && queryResult.length ? +queryResult[0].count : 0;

                res.status(200).send({count: count});
            });
    };

    this.createAdvertisement = function (req, res, next) {

        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows create _advertisement_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement
         *
         * @example Response example:
         *
         * {
         *     "text": "Clinic research"
         * }
         * @param {string} text - text of new advertisement
         * @method createAdvertisement
         * @instance
         */

        var options = req.body;

        Advertisement.createValid(options, function (err, advertisement) {

            if (err) {

                return next(err);
            }

            if (options.image) {
                var  imageParams = {
                    imageUrl: options.image,
                    imageable_id: advertisement.id,
                    imageable_type: TABLES.ADVERTISEMENT,
                    imageable_field: 'image'
                };

                image.newImage(imageParams, function () {

                    res.status(201).send({
                        success: RESPONSES.WAS_CREATED,
                        article: advertisement
                    });

                });
            } else {
                res.status(201).send({
                    success: RESPONSES.WAS_CREATED,
                    advertisement: advertisement
                });
            }

        });
    };

    this.updateAdvertisement = function (req, res, next) {

        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update _advertisement_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement/:id
         *
         * @example Response example:
         *
         * {
         *     "text": "Clinic research"
         * }
         * @param {number} id - id of advertisement
         * @param {string} text - text of advertisement
         * @method updateArticle
         * @instance
         */

        var advertisementId = req.params.id;
        var options = req.body;
        var error;

        if (!advertisementId) {
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        options.id = advertisementId;

        Advertisement.updateValid(options, function (err, result) {

            if (err) {
                return next(err);
            }

            if (options.image && typeof options.image === 'string') {

                var  imageParams = {
                    imageUrl: options.image,
                    imageable_id: result.id,
                    imageable_type: TABLES.ADVERTISEMENT,
                    imageable_field: 'image'
                };

                image.updateOrCreateImageByClientProfileId(imageParams, function () {

                    res.status(200).send({
                        success: RESPONSES.UPDATED_SUCCESS,
                        article: result
                    });
                });
            } else {

                res.status(201).send({
                    success: RESPONSES.WAS_CREATED,
                    advertisement: result
                });
            }
        });
    };

    this.removeAdvertisement = function (req, res, next){

        /**
         * __Type__ `DELETE`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows delete _advertisement_
         *
         * @example Request example:
         *         http://192.168.88.250:8787/advertisement/:id
         *
         * @example Response example:
         *
         * {
         *   "success": "was removed successfully"
         * }
         *
         * @param {number} id - id of advertisement
         * @method removeAdvertisement
         * @instance
         */

        var advertisementId = req.params.id;
        var error;

        if(!advertisementId){
            error = new Error(RESPONSES.NOT_ENOUGH_PARAMETERS);
            error.status = 400;

            return next(error);
        }

        Advertisement
            .where({id: advertisementId})
            .destroy()
            .asCallback(function(err){

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    success: RESPONSES.REMOVE_SUCCESSFULY
                });
            });
    };
};

module.exports = Advertisement;


