var RESPONSES = require('../constants/responseMessages');
var TABLES = require('../constants/tables');

var async = require('../node_modules/async');
var _ = require('../node_modules/underscore');

var HospitalHelper = require('../helpers/hospitals');

var Hospitals;

/**
 * @description Hospital management module
 * @module hospitals
 *
 */

Hospitals = function (PostGre) {
    var hospitalHelper = new HospitalHelper(PostGre);

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
         *     "phone_number": "+380548954782",
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
         * @param {number} phone_number - phone number of clinic
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

        hospitalHelper.createHospitalByOptions(options, {checkFunctions: [
            'checkHospitalType',
            'checkHospitalRegion',
            'checkHospitalTreatment',
            'checkHospitalSubTreatment',
            'checkUniqueHospitalName'

        ]}, function (err, result) {

            if (err) {
                return next(err);
            }

            res.status(201).send({
                success: RESPONSES.WAS_CREATED,
                hospital_id: result
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
         *     "phone_number": "+380548954782",
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
         * @param {number} phone_number - phone number of clinic
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
        options.hospital_id = req.params.id;

        hospitalHelper.updateHospitalByOptions(options, {checkFunctions: [
            'checkExistingHospital',
            'checkHospitalType',
            'checkHospitalRegion',
            'checkHospitalTreatment',
            'checkHospitalSubTreatment',
            'checkUniqueHospitalName'

        ]}, function (err, result) {

            if (err) {
                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                hospital_id: result
            });

        })
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
        var limit = req.query.limit;
        var offset = req.query.page;
        var options = {
            limit: 25,
            offset: 0
        };

        if (limit && !isNaN(limit) && limit > 0) {
            options.limit = limit;
        }

        if (offset && !isNaN(offset) && offset - 1 > 0) {
            options.limit = offset - 1;
        }

        hospitalHelper.getHospitalByOptions(options, function (err, hospitals) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospitals);
        })
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
        var hospitalId = parseInt(req.params.id);

        hospitalHelper.getHospitalByOptions(hospitalId, function (err, hospital) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospital);
        })
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

        hospitalHelper.deleteHospital(hospitalId, function (err) {

            if (err) {
                return next(err);
            }

            res.status(200).send({
                success: RESPONSES.REMOVE_SUCCESSFULY
            });
        })
    }
};

module.exports = Hospitals;

