var RESPONSES = require('../constants/responseMessages');
//var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');
var Validation = require('../helpers/validation');
var Session = require('../handlers/sessions');
var _ = require('underscore');
var async = require('async');

var Hospitals = function (PostGre) {
    var self = this;
    var Hospital = PostGre.Models[TABLES.HOSPITALS];
    var HospitalType = PostGre.Models[TABLES.HOSPITAL_TYPES_LIST];
    var Region = PostGre.Models[TABLES.REGIONS_LIST];
    var HospitalTreatment = PostGre.Models[TABLES.TREATMENTS];
    var HospitalSubTreatment = PostGre.Models[TABLES.SUB_TREATMENTS];
    var TreatmentsList = PostGre.Models[TABLES.TREATMENTS_LIST];
    var SubTreatmentsList = PostGre.Models[TABLES.SUB_TREATMENTS_LIST];

    var Image = require('./images');
    var image = new Image(PostGre);

    function assert(fn) {
        var error;

        if (typeof fn !== 'function') {
            error = new Error(typeof fn + ' is not a function');
            throw error;
        }
    }

    function createHospital(data, callback) {

        assert(callback);

        Hospital
            .forge()
            .save(data, {
                require: true
            })
            .asCallback(function (err, hospital) {

                if (err) {
                    return callback(err);
                }

                callback(null, hospital.id);

            })
    }

    function createHospitalTreatment(treatmentIds, hospitalId, callback) {

        assert(callback);

        async.eachSeries(treatmentIds, function (treatmentId, innerCallback) {

            HospitalTreatment
                .forge()
                .save({
                    hospital_id: hospitalId,
                    treatment_id: treatmentId
                }, {
                    require: true
                })
                .asCallback(innerCallback)
        }, callback);
    }

    function createHospitalSubTreatment(subTreatmentIds, hospitalId, callback) {

        assert(callback);

        async.eachSeries(subTreatmentIds, function (subTreatmentId, innerCallback) {

            HospitalSubTreatment
                .forge()
                .save({
                    hospital_id: hospitalId,
                    sub_treatment_id: subTreatmentId
                }, {
                    require: true
                })
                .asCallback(innerCallback)
        }, callback);
    }

    function updateHospital(hospitalId, data, callback) {
        assert(callback);

        Hospital
            .forge({
                id: hospitalId
            })
            .save(data, {
                method: 'update',
                require: true
            })
            .asCallback(function (err, hospital) {

                if (err) {
                    return callback(err);
                }

                callback(null, hospital.id);
            });
    }

    function updateHospitalTreatment(treatmentIds, hospitalId, callback) {

        assert(callback);

        HospitalTreatment
            .forge()
            .where({
                hospital_id: hospitalId
            })
            .destroy()
            .asCallback(function (err) {

                if (err) {
                    return callback(err);
                }

                async.eachSeries(treatmentIds, function (treatmentId, innerCallback) {

                    HospitalTreatment
                        .forge()
                        .save({
                            hospital_id: hospitalId,
                            treatment_id: treatmentId
                        }, {
                            require: true
                        })
                        .asCallback(innerCallback)
                }, callback);
            })
    }

    function updateHospitalSubTreatment(subTreatmentIds, hospitalId, callback) {

        assert(callback);

        HospitalSubTreatment
            .forge()
            .where({
                hospital_id: hospitalId
            })
            .destroy()
            .asCallback(function (err) {

                if (err) {
                    return callback(err);
                }

                async.eachSeries(subTreatmentIds, function (subTreatmentId, innerCallback) {

                    HospitalSubTreatment
                        .forge()
                        .save({
                            hospital_id: hospitalId,
                            sub_treatment_id: subTreatmentId
                        }, {
                            require: true
                        })
                        .asCallback(innerCallback);

                }, callback);
            })
    }

    function getHospitalById(id, callback) {

        assert(callback);

        Hospital
            .query(function(qb){
                qb.select(
                    PostGre.knex.raw('TO_CHAR( ' + TABLES.HOSPITALS + '.created_at, \'D. Mon YYYY\') AS created_at '),

                    PostGre.knex.raw(
                        '(SELECT JSON_AGG(treatments_result) ' +
                        '   FROM ( ' +
                        '       SELECT treatment.name ' +
                        '           FROM ' + TABLES.TREATMENTS_LIST + ' treatment ' +
                        '           LEFT JOIN ' + TABLES.TREATMENTS + ' hospital_treatment ' +
                        '               ON treatment.id = hospital_treatment.treatment_id ' +
                        '           WHERE hospital_treatment.hospital_id = ' + TABLES.HOSPITALS + '.id ' +
                        '       ) treatments_result ' +
                        ') AS treatments '
                    ),

                    PostGre.knex.raw(
                        '(SELECT JSON_AGG(sub_treatments_result) ' +
                        '   FROM ( ' +
                        '       SELECT sub_treatment.name ' +
                        '           FROM ' + TABLES.SUB_TREATMENTS_LIST + ' sub_treatment ' +
                        '           LEFT JOIN ' + TABLES.SUB_TREATMENTS + ' hospital_sub_treatment ' +
                        '               ON sub_treatment.id = hospital_sub_treatment.sub_treatment_id ' +
                        '           WHERE hospital_sub_treatment.hospital_id = ' + TABLES.HOSPITALS + '.id ' +
                        '       ) sub_treatments_result ' +
                        ') AS sub_treatments '
                    ),

                    TABLES.HOSPITALS + '.id',
                    TABLES.HOSPITALS + '.is_paid',
                    TABLES.HOSPITALS + '.name',
                    TABLES.HOSPITALS + '.address',
                    TABLES.HOSPITALS + '.phone_number',
                    TABLES.HOSPITALS + '.email',
                    TABLES.HOSPITALS + '.description'
                );

                qb.leftJoin(TABLES.HOSPITAL_TYPES_LIST, TABLES.HOSPITAL_TYPES_LIST + '.id', TABLES.HOSPITALS + '.type_id');
                qb.where(TABLES.HOSPITALS + '.id', id);
            })
            .fetch({
                withRelated: [
                    'logo'
                ],
                require: true
            })
            .asCallback(callback);
    }

    function getHospitals(options, callback) {

        assert(callback);

        Hospital
            .query(function(qb){
                qb.select(
                    PostGre.knex.raw('TO_CHAR( ' + TABLES.HOSPITALS + '.created_at, \'D. Mon YYYY\') AS created_at '),

                    PostGre.knex.raw('ST_X(' + TABLES.HOSPITALS + '.position::geometry) AS latitude '),
                    PostGre.knex.raw('ST_Y(' + TABLES.HOSPITALS + '.position::geometry) AS longitude '),

                    TABLES.HOSPITALS + '.id',
                    TABLES.HOSPITALS + '.is_paid',
                    TABLES.HOSPITALS + '.name',
                    TABLES.HOSPITALS + '.address',
                    TABLES.HOSPITALS + '.phone_number',
                    TABLES.HOSPITALS + '.email',
                    TABLES.HOSPITALS + '.description'
                );

                qb.leftJoin(TABLES.HOSPITAL_TYPES_LIST, TABLES.HOSPITAL_TYPES_LIST + '.id', TABLES.HOSPITALS + '.type_id');
                qb.orderBy(TABLES.HOSPITALS + '.created_at', 'DESC');
                qb.limit(options.limit);
                qb.offset(options.offset);
            })
            .fetchAll({
                withRelated: [
                    'logo'
                ]
            })
            .asCallback(callback);
    }

    this.checkFunctions = {
        checkHospitalType: function (options, validatedOptions, callback) {
           assert(callback);

            HospitalType
                .forge({
                    id: validatedOptions.type_id
                })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        },

        checkHospitalRegion: function (options, validatedOptions, callback) {
            assert(callback);

            Region
                .forge({
                    id: validatedOptions.region_id
                })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        },

        checkHospitalTreatment: function (options, validatedOptions, callback) {

            assert(callback);

            TreatmentsList
                .query(function (qb) {
                    qb.whereIn('id', options.treatment_ids)
                })
                .fetchAll({
                    require: true
                })
                .asCallback(function (err, treatment) {
                    var treatmentError;

                    if (err || treatment.models.length !== options.treatment_ids.length) {
                        treatmentError = err || new Error(RESPONSES.CLINIC_TREATMENT_ERROR);
                        treatmentError.status = 400;

                        return callback(treatmentError);
                    }

                    callback();

                })
        },

        checkHospitalSubTreatment: function (options, validatedOptions, callback) {

            assert(callback);

            SubTreatmentsList
                .query(function (qb) {
                    qb.whereIn('id', options.sub_treatments)
                })
                .fetchAll({
                    require: true
                })
                .asCallback(function (err, subTreatment) {
                    var subTreatmentError;

                    if (err || subTreatment.models.length !== options.sub_treatments.length) {
                        subTreatmentError = err || new Error(RESPONSES.CLINIC_SUB_TREATMENT_ERROR);
                        subTreatmentError.status = 400;

                        return callback(subTreatmentError);
                    }

                    callback();
                });
        },

        checkUniqueHospitalName: function (options, validatedOptions, callback) {
            var nonUniqueNameError;
            assert(callback);

            Hospital
                .forge({
                    name: validatedOptions.name
                })
                .fetch()
                .asCallback(function (err, hospital) {

                    if (err || (hospital && hospital.id !== parseInt(options.hospital_id))) {
                        nonUniqueNameError = err || new Error(RESPONSES.NON_UNIQUE_NAME_ERROR);
                        nonUniqueNameError.status = 400;

                        return callback(nonUniqueNameError);
                    }
                    callback();
                });
        },

        checkExistingHospital: function (options, validatedOptions, callback) {

            assert(callback);

            Hospital
                .forge({
                    id: validatedOptions.hospital_id
                })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        }
    };

    this.checkCreateHospitalOptions = new Validation.Check({
        region_id: ['required', 'isInt'],
        is_paid: ['required', 'isBoolean'],
        type_id: ['required', 'isInt'],
        name: ['required', 'isString'],
        description: ['isString'],
        address: ['isString'],
        phone_number: ['isArray'],
        email: ['isArray'],
        web_address: ['isString'],
        position: ['isPosition']

    }, self.checkFunctions);

    this.checkUpdateHospitalOptions = new Validation.Check({
        hospital_id: ['required', 'isInt'],
        region_id: ['required', 'isInt'],
        is_paid: ['required', 'isBoolean'],
        type_id: ['required', 'isInt'],
        name: ['required', 'isString'],
        description: ['isString'],
        address: ['isString'],
        phone_number: ['isArray'],
        email: ['isArray'],
        web_address: ['isString'],
        position: ['isPosition']
    }, self.checkFunctions);

    this.createHospitalByOptions = function (options, settings, callback) {

        self.checkCreateHospitalOptions.run(options, settings, function (errors, validOptions) {

            if (errors) {
                return callback(errors)
            }

            createHospital(validOptions, function (err, hospitalId) {

                var functionsToExecute = [
                    async.apply(createHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(createHospitalSubTreatment, options.sub_treatments, hospitalId)
                ];

                if (options.logo) {
                    var  imageParams = {
                        imageUrl: options.logo,
                        imageable_id: hospitalId,
                        imageable_type: TABLES.HOSPITALS,
                        imageable_field: 'logo'
                    };

                    functionsToExecute.push(async.apply(image.newImage, imageParams));
                }

                async.parallel(functionsToExecute, function (err) {

                    if (err) {

                        self.deleteHospital(hospitalId, function () {
                            return callback(err);
                        });
                    }

                    callback(null, hospitalId);
                });
            });
        });
    };

    this.updateHospitalByOptions = function (options, settings, callback) {

        self.checkUpdateHospitalOptions.run(options, settings, function (errors, validOptions) {
            var hospitalId;

            if (errors) {
                return callback(errors)
            }

            hospitalId = validOptions.hospital_id;
            delete validOptions.hospital_id;

            updateHospital(hospitalId, validOptions, function (err, hospitalId) {
                var  imageParams;

                var functionsToExecute = [
                    async.apply(updateHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(updateHospitalSubTreatment, options.sub_treatments, hospitalId)
                ];

                if (options.logo) {

                    imageParams = {
                        imageUrl: options.logo,
                        imageable_id: hospitalId,
                        imageable_type: TABLES.HOSPITALS,
                        imageable_field: 'logo'
                    };

                    functionsToExecute.push(async.apply(image.updateOrCreateImageByClientProfileId, imageParams));
                }

                async.parallel(functionsToExecute, function (err) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, hospitalId);
                });
            });
        });
    };

    this.getHospitalByOptions = function (options, callback) {

        var error;
        var errorMessage;

        if (+options && typeof +options === 'number') {

            getHospitalById(options, callback);
        } else if (typeof options === 'object') {

            getHospitals(options, callback);
        } else {
            errorMessage = !options ? RESPONSES.NOT_ENOUGH_PARAMETERS : RESPONSES.INVALID_PARAMETERS;

            error = new Error(errorMessage);
            error.status = 400;

            callback(error);
        }
    };

    this.getHospitalsCount = function (callback) {

        assert(callback);

        PostGre.knex(TABLES.HOSPITALS)
            .count()
            .asCallback(function (err, queryResult) {
               var  clientsCount;

                if (err) {
                    return callback(err);
                }

                clientsCount = queryResult && queryResult.length ? +queryResult[0].count : 0;

                callback(null, clientsCount);
            });
    };

    this.deleteHospital = function (hospitalId, callback) {

        Hospital
            .forge({
                id: hospitalId
            })
            .destroy()
            .asCallback(callback);
    }
};

module.exports = Hospitals;