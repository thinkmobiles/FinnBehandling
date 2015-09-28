var RESPONSES = require('../constants/responseMessages');
//var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');
var Validation = require('../helpers/validation');
var Session = require('../handlers/sessions');
var _ = require('../node_modules/underscore');
var async = require('../node_modules/async');

var Hospitals;

Hospitals = function (PostGre) {
    var self = this;
    var Hospital = PostGre.Models[TABLES.HOSPITALS];
    var HospitalType = PostGre.Models[TABLES.HOSPITAL_TYPES_LIST];
    var Region = PostGre.Models[TABLES.REGIONS_LIST];
    var HospitalTreatment = PostGre.Models[TABLES.TREATMENTS];
    var HospitalSubTreatment = PostGre.Models[TABLES.SUB_TREATMENTS];
    var TreatmentsList = PostGre.Models[TABLES.TREATMENTS_LIST];
    var SubTreatmentsList = PostGre.Models[TABLES.SUB_TREATMENTS_LIST];

    function createHospital(data, callback) {
        var saveError;

        Hospital
            .forge()
            .save(data)
            .asCallback(function (err, hospital) {

                if (err || !(hospital && hospital.id)) {
                    saveError = err || new Error(RESPONSES.SAVE_ERROR);
                    saveError.status = 500;

                    return callback(saveError);
                }

                callback(null, hospital.id);

            })
    }

    function createHospitalTreatment(treatmentId, hospitalId, callback) {
        var saveError;
        var responseData = {
            hospital_id: hospitalId
        };

        HospitalTreatment
            .forge()
            .save({
                hospital_id: hospitalId,
                treatment_id: treatmentId
            })
            .asCallback(function (err, treatment) {

                if (err || !(treatment && treatment.id)) {
                    saveError = err || new Error(RESPONSES.SAVE_ERROR);
                    saveError.status = 500;

                    return callback(saveError);
                }

                responseData.treatment_id = treatment.id;
                callback(null, responseData);

            })
    }

    function createHospitalSubTreatment(subTreatmentIds, data, callback) {
        var saveError;

        async.eachSeries(subTreatmentIds, function (subTreatmentId, cb) {

            HospitalSubTreatment
                .forge()
                .save({
                    treatment_id: data.treatment_id,
                    sub_treatment_id: subTreatmentId
                })
                .asCallback(function (err, subTreatment) {

                    if (err || !(subTreatment && subTreatment.id)) {
                        saveError = err || new Error(RESPONSES.SAVE_ERROR);
                        saveError.status = 500;

                        return cb(saveError);
                    }

                    cb();

                })
        }, function (err) {

            if (err) {
                return callback(err)
            }
            callback(null, data)
        });

    }

    this.checkFunctions = {
        checkHospitalType: function (options, validatedOptions, callback) {
            var typeError;

            HospitalType
                .forge({
                    id: validatedOptions.type_id
                })
                .fetch()
                .asCallback(function (err, type) {
                    if (err || !(type && type.id)) {
                        typeError = err || new Error(RESPONSES.CLINIC_TYPE_ERROR);
                        typeError.status = 400;

                        return callback(typeError);
                    }

                    callback();

                })
        },

        checkHospitalRegion: function (options, validatedOptions, callback) {
            var regionError;

            Region
                .forge({
                    id: validatedOptions.region_id
                })
                .fetch()
                .asCallback(function (err, region) {

                    if (err || !(region && region.id)) {
                        regionError = err || new Error(RESPONSES.CLINIC_REGION_ERROR);
                        regionError.status = 400;

                        return callback(regionError);
                    }

                    callback();

                })
        },

        checkHospitalTreatment: function (options, validatedOptions, callback) {
            var treatmentError;

            TreatmentsList
                .forge({
                    id: options.treatment_id
                })
                .fetch()
                .asCallback(function (err, treatment) {

                    if (err || !(treatment && treatment.id)) {
                        treatmentError = err || new Error(RESPONSES.CLINIC_TREATMENT_ERROR);
                        treatmentError.status = 400;

                        return callback(treatmentError);
                    }

                    callback();

                })
        },

        checkHospitalSubTreatment: function (options, validatedOptions, callback) {
            var subTreatmentError;

            SubTreatmentsList
                .query(function (qb) {
                    qb.whereIn('id', options.sub_treatments)
                })
                .fetchAll()
                .asCallback(function (err, subTreatment) {

                    if (err || !subTreatment || !subTreatment.models || subTreatment.models.length !== options.sub_treatments.length) {
                        subTreatmentError = err || new Error(RESPONSES.CLINIC_SUB_TREATMENT_ERROR);
                        subTreatmentError.status = 400;

                        return callback(subTreatmentError);
                    }

                    callback();

                })
        },

        checkUniqueHospitalName: function (options, validatedOptions, callback) {
            var nonUniqueNameError;

            Hospital
                .forge({
                    name: validatedOptions.name
                })
                .fetch()
                .asCallback(function (err, hospital) {

                    if (err || (hospital && hospital.id)) {
                        nonUniqueNameError = err || new Error(RESPONSES.NON_UNIQUE_NAME_ERROR);
                        nonUniqueNameError.status = 400;

                        return callback(nonUniqueNameError);
                    }
                    callback()
                })

        }
    };

    this.checkCreateHospitalOptions = new Validation.Check({
        region_id: ['required', 'isInt'],
        is_paid: ['required', 'isBoolean'],
        type_id: ['required', 'isInt'],
        name: ['required', 'isString']

    }, self.checkFunctions);

    this.createHospitalByOptions = function (options, callback, settings) {

        self.checkCreateHospitalOptions.run(options, function (errors, validOptions) {

            if (errors) {
                return callback(errors)
            }

            async.waterfall([
                async.apply(createHospital, validOptions),
                async.apply(createHospitalTreatment, options.treatment_id),
                async.apply(createHospitalSubTreatment, options.sub_treatments)

            ], function (err, result) {

                if (err) {
                    return callback(err);
                }

                callback(null, result.hospital_id);
            })

        }, settings);
    };

    this.updateHospitalByOptions = function (options, callback, settings) {

    };


};

module.exports = Hospitals;