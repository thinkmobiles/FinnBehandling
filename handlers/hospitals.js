var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('../node_modules/async');
var _ = require('../node_modules/underscore');

var Hospitals;

/**
 * @description Hospital management module
 * @module hospitals
 *
 */

Hospitals = function (PostGre) {

    var self = this;
    var Hospital = PostGre.Models[TABLES.HOSPITALS];
    var HospitalTreatment = PostGre.Models[TABLES.TREATMENTS];
    var HospitalSubTreatment = PostGre.Models[TABLES.SUB_TREATMENTS];

    var Image = require('../helpers/images');
    var image = new Image(PostGre);

    this.createHospital = function (req, res, next) {
        /**
         * __Type__ `POST`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows create new hospital
         *
         * @example Request example:
         *         http://localhost:8787/hospitals
         * {
         *     "region_id" : 1,
         *     "is_paid": false,
         *     "type_id": 1,
         *     "name": "New test clinic",
         *     "treatment_ids": [2,1,3],
         *     "sub_treatments": [1,2,4,3,5],
         *     "description": "Lorem ipsum...",
         *     "email": ["some@mail.com", "some2@mail.com"]
         *     "phone_number": ["+380548954782", "+380548951111"]
         *     "web_address": "www.clinic.com"
         *
         * }
         * @param {number} region_id - id of region
         * @param {boolean} is_paid - payments status
         * @param {number} type_id - id of clinic type
         * @param {string} name - name of clinic
         * @param {array} treatment_ids - list of treatments
         * @param {array} sub_treatments - list of sub_treatments
         * @param {string} description - description of clinic
         * @param {array} phone_number - phone number of clinic
         * @param {array} email - emails of clinic
         * @param {string} web_address - web address of clinic
         *
         * @example Response example:
         * {
         *       "success": "Was created successfully",
         *       "hospital_id": 3
         * }
         * @method createHospital
         * @instance
         */
        var options = req.body;

        Hospital.createValid(options, function (err, hospital) {

            if (err) {
                return next(err);
            }

            var hospitalId = hospital.id;
            var functionsToExecute = [
                function (callback) {
                    HospitalSubTreatment.create(options.sub_treatments, hospitalId, callback);
                }
            ];

            if (options.logo) {
                var  imageParams = {
                    imageUrl: options.logo,
                    imageable_id: hospitalId,
                    imageable_type: TABLES.HOSPITALS,
                    imageable_field: 'logo'
                };

                functionsToExecute.push(
                    function (callback) {
                        image.newImage(imageParams, callback);
                    }
                );
            }

            async.parallel(functionsToExecute, function (err) {

                if (err) {

                    Hospital.delete(hospitalId, function () {
                        return next(err);
                    });
                }

                res.status(201).send({
                    success: RESPONSES.WAS_CREATED,
                    hospital_id: hospitalId
                });
            });
        });
    };

    this.updateHospital = function (req, res, next) {
        /**
         * __Type__ `PUT`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows update existing hospital
         *
         * @example Request example:
         *         http://localhost:8787/hospitals/:id
         * {
         *     "region_id" : 1,
         *     "is_paid": false,
         *     "type_id": 1,
         *     "name": "New Name",
         *     "treatment_ids": [2,1,3],
         *     "sub_treatments": [1,2,4,3,5],
         *     "description": "Lorem ipsum...",
         *     "email": ["some@mail.com", "some2@mail.com"]
         *     "phone_number": ["+380548954782", "+380548951111"]
         *     "web_address": "www.clinic.com"
         *
         * }
         * @param {number} region_id - id of region
         * @param {boolean} is_paid - payments status
         * @param {number} type_id - id of clinic type
         * @param {string} name - name of clinic
         * @param {array} treatment_ids - list of treatments
         * @param {array} sub_treatments - list of sub_treatments
         * @param {string} description - description of clinic
         * @param {array} phone_number - phone number of clinic
         * @param {array} email - emails of clinic
         * @param {string} web_address - web address of clinic
         *
         * @example Response example:
         * {
         *       "success": "Was updated successfully",
         *       "hospital_id": 3
         * }
         * @method updateHospital
         * @instance
         */
        var options = req.body;
        options.id = req.params.id;

        Hospital.updateValid(options, function (err, hospital) {

            if (err) {
                return next(err);
            }

            var hospitalId = hospital.id;
            var functionsToExecute = [
                function (callback) {
                    HospitalSubTreatment.update(options.sub_treatments, hospitalId, callback);
                }
            ];

            if (options.logo) {
                var  imageParams = {
                    imageUrl: options.logo,
                    imageable_id: hospitalId,
                    imageable_type: TABLES.HOSPITALS,
                    imageable_field: 'logo'
                };

                functionsToExecute.push(
                    function (callback) {
                        image.updateOrCreateImageByClientProfileId(imageParams, callback);
                    }
                );
            }

            async.parallel(functionsToExecute, function (err) {

                if (err) {
                    return next(err);
                }

                res.status(200).send({
                    success: RESPONSES.UPDATED_SUCCESS,
                    hospital_id: hospitalId
                });
            });
        });
    };

    this.getAllHospitals = function (req, res, next) {
        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get list of hospitals
         *
         * @example Request example:
         *         http://localhost:8787/hospitals
         *

         *
         * @example Response example:
         *     [
         *        {
         *            "id": 3,
         *            "name": "rfrfr",
         *            "web_address": "www.clinic.com",
         *            "phone_number": "+380660237194",
         *            "type": "type1",
         *            "adress": {
         *                "zip_code": "111",
         *                "kommune_name": "kom1",
         *                "fylke_name": "ful1"
         *            },
         *            "treatments": [
         *                {
         *                    "name": "treatment3"
         *                }
         *            ],
         *            "sub_treatments": [
         *                {
         *                    "name": "sub_treatment1"
         *                },
         *                {
         *                    "name": "sub_treatment2"
         *                },
         *                {
         *                    "name": "sub_treatment4"
         *                }
         *            ],
         *           "texts": [
         *                {
         *                    "content": "Lorem ipsum...",
         *                    "type": "description"
         *                }
         *            ]
         *        }
         *        ]
         * @method getAllHospitals
         * @instance
         */

        var options = {};
        var limit = req.query.limit;
        var page = req.query.page;

        var limitIsValid = limit && !isNaN(limit) && limit > 0;
        var offsetIsValid = page && !isNaN(page) && page > 1;

        options.limit = limitIsValid ? limit : 25;
        options.offset = offsetIsValid ? (page - 1) * options.limit : 0;
        options.fylke = req.query.fylke !== 'Alle' ? req.query.fylke : null;
        options.textSearch = req.query.textSearch ? req.query.textSearch : null;
        options.subTreatment = req.query.subTreatment ? req.query.subTreatment : null;
        options.treatment = req.query.treatment ? req.query.treatment : null;

        Hospital.getAll(options, function (err, hospitals) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospitals);
        });
    };

    this.getHospitalsCount = function (req, res, next) {
        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get hospitals count
         *
         * @example Request example:
         *         http://localhost:8787/hospitals/count
         *

         *
         * @example Response example:
         *
         *       {
         *          "count": 3
         *      }
         *
         * @method getHospitalsCount
         * @instance
         */

        var fylke = req.query.fylke !== 'Alle' ? req.query.fylke : null;
        var textSearch = req.query.textSearch ? req.query.textSearch : null;
        var subTreatment = req.query.subTreatment ? req.query.subTreatment : null;
        var treatment = req.query.treatment ? req.query.treatment : null;

        Hospital
            .query(function (qb) {
                if (fylke) {
                    qb.where(TABLES.REGIONS_LIST + '.fylke', fylke);
                }

                if (textSearch) {
                    qb.where(PostGre.knex.raw(
                        '(LOWER(' + TABLES.HOSPITALS + '.name) LIKE LOWER(\'%' + textSearch + '%\') OR ' +
                        'LOWER(' + TABLES.HOSPITALS + '.description) LIKE LOWER(\'%' + textSearch + '%\') OR ' +
                        'LOWER(' + TABLES.HOSPITALS + '.address) LIKE LOWER(\'%' + textSearch + '%\') OR ' +
                        'LOWER(' + TABLES.HOSPITALS + '.postcode) LIKE LOWER(\'%' + textSearch + '%\') OR ' +
                        'LOWER(' + TABLES.HOSPITALS + '.web_address) LIKE LOWER(\'%' + textSearch + '%\'))'
                    ));
                }

                qb.leftJoin(TABLES.REGIONS_LIST, TABLES.REGIONS_LIST + '.postnummer', TABLES.HOSPITALS + '.postcode');

                qb.whereNotNull(TABLES.REGIONS_LIST + '.postnummer');

                if (subTreatment) {

                    qb.leftJoin(TABLES.SUB_TREATMENTS, TABLES.SUB_TREATMENTS + '.hospital_id', TABLES.HOSPITALS + '.id');
                    qb.where(TABLES.SUB_TREATMENTS + '.sub_treatment_id', subTreatment);

                } else if (treatment) {

                    qb.leftJoin(TABLES.SUB_TREATMENTS, TABLES.SUB_TREATMENTS + '.hospital_id', TABLES.HOSPITALS + '.id');
                    qb.leftJoin(TABLES.SUB_TREATMENTS_LIST, TABLES.SUB_TREATMENTS_LIST + '.id', TABLES.SUB_TREATMENTS + '.sub_treatment_id');
                    qb.where(TABLES.SUB_TREATMENTS_LIST + '.treatment_id', treatment);
                }

                qb.count();
            })
            .fetch()
            .asCallback(function (err, result) {
                var  count;

                if (err) {
                    return next(err);
                }

                count = result ? result.get('count') : 0;

                res.status(200).send({count: count});
            });
    };

    this.getConflicts = function (req, res, next) {
        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows _get list of hospitals where postcode not in regions DB_
         *
         * @example Request example:
         *         http://localhost:8787/hospitals/conflicts
         *
         *
         * @example Response example:
         *     [
         *        {
         *            "id": 3,
         *            "name": "rfrfr",
         *            "web_address": "www.clinic.com",
         *            "phone_number": "+380660237194",
         *            "type": "type1",
         *            "adress": {
         *                "zip_code": "111",
         *                "kommune_name": "kom1",
         *                "fylke_name": "ful1"
         *            }
         *        }
         *    ]
         * @method getConflicts
         * @instance
         */

        Hospital
            .query(function (qb) {
                qb.leftJoin(TABLES.REGIONS_LIST, TABLES.REGIONS_LIST + '.postnummer', TABLES.HOSPITALS + '.postcode');
                qb.whereNull('postnummer');
            })
            .fetchAll({
                columns: [TABLES.HOSPITALS + '.id', 'name', TABLES.HOSPITALS + '.postcode']
            })
            .asCallback(function (err, hospitals) {
                if (err) {
                    return next(err);
                }

                res.status(200).send(hospitals);
            });
    };

    this.getHospital = function (req, res, next) {
        /**
         * __Type__ `GET`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows get hospital id
         *
         * @example Request example:
         *         http://localhost:8787/hospitals/:id
         *

         *
         * @example Response example:
         *
         *        {
         *            "id": 3,
         *            "name": "rfrfr",
         *            "web_address": "www.clinic.com",
         *            "phone_number": "+380660237194",
         *            "type": "type1",
         *            "adress": {
         *                "zip_code": "111",
         *                "kommune_name": "kom1",
         *                "fylke_name": "ful1"
         *            },
         *            "treatments": [
         *                {
         *                    "name": "treatment3"
         *                }
         *            ],
         *            "sub_treatments": [
         *                {
         *                    "name": "sub_treatment1"
         *                },
         *                {
         *                    "name": "sub_treatment2"
         *                },
         *                {
         *                    "name": "sub_treatment4"
         *                }
         *            ],
         *           "texts": [
         *                {
         *                    "content": "Lorem ipsum...",
         *                    "type": "description"
         *                }
         *            ]
         *        }
         *
         * @method getHospital
         * @instance
         */
        var hospitalId = req.params.id;

        Hospital.getOne(hospitalId, function (err, hospital) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospital);
        });
    };

    this.deleteHospital = function (req, res, next) {
        /**
         * __Type__ `DELETE`
         * __Content-Type__ `application/json`
         *
         * This __method__ allows delete hospital
         *
         * @example Request example:
         *         http://localhost:8787/hospitals/:id
         *

         *
         * @example Response example:
         *
         *   {
         *       "success": "was removed successfully"
         *   }
         *
         * @method deleteHospital
         * @instance
         */
        var hospitalId = parseInt(req.params.id);

        Hospital.delete(hospitalId, function (err) {

            if (err) {
                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.REMOVE_SUCCESSFULY
            });
        });
    }
};

module.exports = Hospitals;

