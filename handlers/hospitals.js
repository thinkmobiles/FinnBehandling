var RESPONSES = require('../constants/responseMessages');
var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');

var async = require('../node_modules/async');
var _ = require('../node_modules/underscore');

var HospitalHelper = require('../helpers/hospitals');

var Hospitals;

Hospitals = function (PostGre) {
    var Hospital = PostGre.Models[TABLES.HOSPITALS];
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

        }, {checkFunctions: ['checkHospitalType', 'checkHospitalRegion', 'checkHospitalTreatment', 'checkHospitalSubTreatment', 'checkUniqueHospitalName']});
    };

    this.updateHospital = function (req, res, next) {
        var options = req.body;

        hospitalHelper.updateHospitalByOptions(options, function () {

        }, {checkFunctions: []})
    };
};

module.exports = Hospitals;

