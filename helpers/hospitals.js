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
    var HospitalText = PostGre.Models[TABLES.HOSPITAL_TEXTS];
    var HospitalSubTreatment = PostGre.Models[TABLES.SUB_TREATMENTS];
    var TreatmentsList = PostGre.Models[TABLES.TREATMENTS_LIST];
    var SubTreatmentsList = PostGre.Models[TABLES.SUB_TREATMENTS_LIST];

    var getQuery = 'SELECT array_to_json(array_agg(row_to_json(hospital))) ' +
    'FROM (SELECT h.id, h.name, h.web_address, h.phone_number, ht.name as type, ' +
        '(SELECT row_to_json(r) ' +
    'FROM ( ' +
        'SELECT r.zip_code, r.kommune_name, r.fylke_name ' +
    'FROM ' + TABLES.REGIONS_LIST + ' r WHERE r.id = h.region_id ' +
    ') r ' +
    ') AS adress, ' +

        '(SELECT array_to_json(array_agg(row_to_json(t))) ' +
    'FROM ( ' +
        'SELECT t.name ' +
    'FROM ' + TABLES.TREATMENTS_LIST + ' t ' +
    'LEFT JOIN ' + TABLES.TREATMENTS + ' ht ON t.id = ht.treatment_id ' +
    'WHERE ht.hospital_id = h.id ' +
    ') t ' +
    ') AS treatments, ' +

        '(SELECT array_to_json(array_agg(row_to_json(st))) ' +
    'FROM ( ' +
        'SELECT st.name ' +
    'FROM ' + TABLES.SUB_TREATMENTS_LIST + ' st ' +
    'LEFT JOIN ' + TABLES.SUB_TREATMENTS + ' hst ON st.id = hst.sub_treatment_id ' +
    'WHERE hst.hospital_id = h.id ' +
    ') st ' +
    ') AS sub_treatments, ' +

        '(SELECT array_to_json(array_agg(row_to_json(txt))) ' +
    'FROM (' +
        'SELECT txt.content, txt.type ' +
    'FROM ' + TABLES.HOSPITAL_TEXTS + ' txt ' +
    'WHERE txt.hospital_id = h.id ' +
    ') txt ' +
    ') AS texts ' +

    'FROM ' + TABLES.HOSPITALS + ' h ' +
    'LEFT JOIN ' + TABLES.HOSPITAL_TYPES_LIST + ' ht ON ht.id = h.type_id ' +
        '/* mark */ ' +
    ') AS hospital ';

    function createHospital(data, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + ' is not a function');
            throw saveError
        }

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

    function createHospitalTreatment(treatmentIds, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        async.eachSeries(treatmentIds, function (treatmentId, cb) {

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

                        return cb(saveError);
                    }

                    cb();

                })
        }, function (err) {

            if (err) {
                return callback(err)
            }
            callback()
        });
    }

    function createHospitalSubTreatment(subTreatmentIds, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        async.eachSeries(subTreatmentIds, function (subTreatmentId, cb) {

            HospitalSubTreatment
                .forge()
                .save({
                    hospital_id: hospitalId,
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
            callback()
        });

    }

    function createHospitalText(options, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        HospitalText
            .forge()
            .save({
                hospital_id: hospitalId,
                content: options.description,
                type: 'description'
            })
            .asCallback(function (err, text) {

                if (err || !(text && text.id)) {
                    saveError = err || new Error(RESPONSES.SAVE_ERROR);
                    saveError.status = 500;

                    return callback(saveError);
                }

                callback();

            })

    }

    function updateHospital(hospitalId, data, callback) {

        Hospital
            .forge({
                id: hospitalId
            })
            .save(data, {
                method: 'update'
            })
            .asCallback(function (err, hospital) {

                if (err) {
                    return callback(err)
                }

                callback(null, hospital.id)
            })
    }

    function updateHospitalTreatment(treatmentIds, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        HospitalTreatment
            .forge()
            .where({
                hospital_id: hospitalId
            })
            .destroy()
            .asCallback(function (err) {

                if (err) {
                    return callback(err)
                }

                async.eachSeries(treatmentIds, function (treatmentId, cb) {

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

                                return cb(saveError);
                            }

                            cb();

                        })
                }, function (err) {

                    if (err) {
                        return callback(err)
                    }
                    callback()
                });
            })
    }

    function updateHospitalSubTreatment(subTreatmentIds, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        HospitalSubTreatment
            .forge()
            .where({
                hospital_id: hospitalId
            })
            .destroy()
            .asCallback(function (err) {

                if (err) {
                    return callback(err)
                }

                async.eachSeries(subTreatmentIds, function (subTreatmentId, cb) {

                    HospitalSubTreatment
                        .forge()
                        .save({
                            hospital_id: hospitalId,
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
                    callback()
                });
            })
    }

    function updateHospitalText(options, hospitalId, callback) {
        var saveError;

        if (typeof callback !== 'function') {
            saveError = new Error(typeof callback + 'is not a function');
            throw saveError
        }

        HospitalText
            .forge()
            .where({
                hospital_id: hospitalId,
                type: 'description'
            })
            .save({
                content: options.description
            }, {
                method: 'update'
            })
            .asCallback(function (err) {

                if (err) {
                    return callback(err);
                }

                callback();

            })
    }

    function getHospitalById(id, callback) {
        var getByIdQuery = 'WHERE hospital.id = ' + id;

        PostGre.knex
            .raw(getQuery + getByIdQuery)
            .asCallback(function (err, querResult) {

                if (err) {
                    return callback(err)
                }

                callback(null, querResult.rows[0].array_to_json[0])
            })
    }

    function getHospitals (options, callback) {
        var getAllquery = getQuery.replace(/\/\* mark \*\//, 'ORDER BY h.created_at OFFSET ' + options.offset + ' LIMIT ' + options.limit);

        PostGre.knex
            .raw(getAllquery)
            .asCallback(function (err, querResult) {

                if (err) {
                    return callback(err)
                }

                callback(null, querResult.rows[0].array_to_json)
            })
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
                .query(function (qb) {
                    qb.whereIn('id', options.treatment_ids)
                })
                .fetchAll()
                .asCallback(function (err, treatment) {

                    if (err || !treatment || !treatment.models || treatment.models.length !== options.treatment_ids.length) {
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

                    if (err || (hospital && hospital.id && hospital.id !== parseInt(options.hospital_id))) {
                        nonUniqueNameError = err || new Error(RESPONSES.NON_UNIQUE_NAME_ERROR);
                        nonUniqueNameError.status = 400;

                        return callback(nonUniqueNameError);
                    }
                    callback()
                })

        },

        checkExistingHospital: function (options, validatedOptions, callback) {
            var hospitalError;

            Hospital
                .forge({
                    id: validatedOptions.hospital_id
                })
                .fetch()
                .asCallback(function (err, hospital) {
                    if (err || !(hospital && hospital.id)) {
                        hospitalError = err || new Error(RESPONSES.CLINIC_ERROR);
                        hospitalError.status = 400;

                        return callback(hospitalError);
                    }

                    callback();

                })
        }
    };

    this.checkCreateHospitalOptions = new Validation.Check({
        region_id: ['required', 'isInt'],
        is_paid: ['required', 'isBoolean'],
        type_id: ['required', 'isInt'],
        name: ['required', 'isString'],
        phone_number: ['isPhone'],
        web_address: ['isString']

    }, self.checkFunctions);

    this.checkUpdateHospitalOptions = new Validation.Check({
        hospital_id: ['required', 'isInt'],
        region_id: ['required', 'isInt'],
        is_paid: ['required', 'isBoolean'],
        type_id: ['required', 'isInt'],
        name: ['required', 'isString'],
        phone_number: ['isPhone'],
        web_address: ['isString']
    }, self.checkFunctions);

    this.createHospitalByOptions = function (options, callback, settings) {

        self.checkCreateHospitalOptions.run(options, function (errors, validOptions) {

            if (errors) {
                return callback(errors)
            }

            createHospital(validOptions, function (err, hospitalId) {

                async.parallel([
                    async.apply(createHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(createHospitalSubTreatment, options.sub_treatments, hospitalId),
                    async.apply(createHospitalText, options, hospitalId)

                ], function (err) {

                    if (err) {

                        Hospital
                            .forge({
                                id: hospitalId
                            })
                            .destroy()
                            .asCallback(function () {
                                return callback(err);
                            })
                    }

                    callback(null, hospitalId);
                })
            })

        }, settings);
    };

    this.updateHospitalByOptions = function (options, callback, settings) {

        self.checkUpdateHospitalOptions.run(options, function (errors, validOptions) {
            var hospitalId;

            if (errors) {
                return callback(errors)
            }
            hospitalId = validOptions.hospital_id;
            delete validOptions.hospital_id;

            updateHospital(hospitalId, validOptions, function (err, hospitalId) {

                async.parallel([
                    async.apply(updateHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(updateHospitalSubTreatment, options.sub_treatments, hospitalId),
                    async.apply(updateHospitalText, options, hospitalId)

                ], function (err) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, hospitalId);
                })

            })


        }, settings);
    };

    this.getHospitalByOptions = function (options, callback) {
        var limit = options.limit || 10;

        if (typeof options === 'number') {

            getHospitalById(options, function (err, hospital) {

                if (err) {
                    return callback(err);
                }

                callback(null, hospital)
            })

        } else {

            getHospitals(options, function (err, hospital) {

                if (err) {
                    return callback(err);
                }

                callback(null, hospital)
            })
        }

    };

    this.deleteHospital = function (hospitalId, callback) {

        Hospital
            .forge({
                id: hospitalId
            })
            .destroy()
            .asCallback(function (err) {
                
                if (err) {
                    return callback(err);
                }

                callback()
            })
    }


};

module.exports = Hospitals;