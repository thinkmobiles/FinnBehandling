var RESPONSES = require('../constants/responseMessages');
//var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

var async = require('../node_modules/async');
var _ = require('../node_modules/underscore');

var HospitalHelper = require('../helpers/hospitals');

var Hospitals;

Hospitals = function (PostGre) {
    var hospitalHelper = new HospitalHelper(PostGre);

    this.createHospital = function (req, res, next) {
        var options = req.body;

        hospitalHelper.createHospitalByOptions(options, function (err, result) {

            if (err) {
                return next(err)
            }

            res.status(201).send({
                success: RESPONSES.WAS_CREATED,
                hospital_id: result
            })

        }, {checkFunctions: [
            'checkHospitalType',
            'checkHospitalRegion',
            'checkHospitalTreatment',
            'checkHospitalSubTreatment',
            'checkUniqueHospitalName'
        ]});
    };

    this.updateHospital = function (req, res, next) {
        var options = req.body;
        options.hospital_id = req.params.id;

        hospitalHelper.updateHospitalByOptions(options, function (err, result) {

            if (err) {
                return next(err)
            }

            res.status(200).send({
                success: RESPONSES.UPDATED_SUCCESS,
                hospital_id: result
            });

        }, {checkFunctions: [
            'checkExistingHospital',
            'checkHospitalType',
            'checkHospitalRegion',
            'checkHospitalTreatment',
            'checkHospitalSubTreatment',
            'checkUniqueHospitalName'
        ]})
    };

    this.getAllHospitals = function (req, res, next) {
        var options = {
            limit: req.query.limit || 25,
            offset: req.query.offset - 1 || 0
        };

        hospitalHelper.getHospitalByOptions(options, function (err, hospitals) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospitals)
        })
    };

    this.getHospital = function (req, res, next) {
        var hospitalId = parseInt(req.params.id);

        hospitalHelper.getHospitalByOptions(hospitalId, function (err, hospital) {

            if (err) {
                return next(err);
            }

            res.status(200).send(hospital)
        })
    };

    this.deleteHospital = function (req, res, next) {
        var hospitalId = parseInt(req.params.id);

        hospitalHelper.deleteHospital(hospitalId, function (err) {

            if (err) {
                return next(err);
            }

            res.status(200).send(RESPONSES.REMOVE_SUCCESSFULY)
        })
    }
};

module.exports = Hospitals;

