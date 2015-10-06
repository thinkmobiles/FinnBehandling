var RESPONSES = require('../constants/responseMessages');
//var CONSTANTS = require('../constants/constants');
var TABLES = require('../constants/tables');
var Validation = require('../helpers/validation');
var Session = require('../handlers/sessions');
var _ = require('underscore');
var async = require('async');

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
        'FROM (SELECT h.id, h.description, h.name, h.web_address, h.phone_number, h.is_paid, ' +
        'to_char(h.created_at, \'D. Mon YYYY\') AS created_at,  ' +
        'ST_X(h.position::geometry) AS latitude,  ST_Y(h.position::geometry) AS longitude, h.email, ht.name as type, ' +
        '( h.address || \'\n\' || (SELECT (r.zip_code || \' \' || r.kommune_name || \' \' || r.fylke_name) ' +
        'FROM ' + TABLES.REGIONS_LIST + ' r WHERE r.id = h.region_id ' +
        ')) AS address, ' +

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
        ') AS sub_treatments ' +

        /*'(SELECT array_to_json(array_agg(row_to_json(txt))) ' +
        'FROM (' +
        'SELECT txt.content, txt.type ' +
        'FROM ' + TABLES.HOSPITAL_TEXTS + ' txt ' +
        'WHERE txt.hospital_id = h.id ' +
        ') txt ' +
        ') AS texts ' +*/

        'FROM ' + TABLES.HOSPITALS + ' h ' +
        'LEFT JOIN ' + TABLES.HOSPITAL_TYPES_LIST + ' ht ON ht.id = h.type_id ' +
        '/* mark */ ' +
        ') AS hospital ';

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
            })
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
                    return callback(err)
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
                        .asCallback(innerCallback)

                }, callback);
            })
    }

    function getHospitalById(id, callback) {

        assert(callback);

        var getByIdQuery = 'WHERE hospital.id = ' + id;

        PostGre.knex
            .raw(getQuery + getByIdQuery)
            .asCallback(function (err, querResult) {

                if (err || !querResult.rows || !querResult.rows[0] || !querResult.rows[0].array_to_json || !querResult.rows[0].array_to_json[0]) {
                    err = err || new Error(RESPONSES.NOT_FOUND);
                    return callback(err);
                }

                callback(null, querResult.rows[0].array_to_json[0]);
            });
    }

    function getHospitals(options, callback) {
        var getAllquery;
        assert(callback);

        getAllquery = getQuery.replace(/\/\* mark \*\//, 'ORDER BY h.created_at OFFSET ' + options.offset + ' LIMIT ' + options.limit);

        PostGre.knex
            .raw(getAllquery)
            .asCallback(function (err, querResult) {

                if (err) {
                    return callback(err);
                }

                callback(null, querResult.rows[0].array_to_json);
            })
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
            var treatmentError;
            assert(callback);

            TreatmentsList
                .query(function (qb) {
                    qb.whereIn('id', options.treatment_ids)
                })
                .fetchAll({
                    require: true
                })
                .asCallback(function (err, treatment) {

                    if (err || treatment.models.length !== options.treatment_ids.length) {
                        treatmentError = err || new Error(RESPONSES.CLINIC_TREATMENT_ERROR);
                        treatmentError.status = 400;

                        return callback(treatmentError);
                    }

                    callback();

                })
        },

        checkHospitalSubTreatment: function (options, validatedOptions, callback) {
            var subTreatmentError;
            assert(callback);

            SubTreatmentsList
                .query(function (qb) {
                    qb.whereIn('id', options.sub_treatments)
                })
                .fetchAll({
                    require: true
                })
                .asCallback(function (err, subTreatment) {

                    if (err || subTreatment.models.length !== options.sub_treatments.length) {
                        subTreatmentError = err || new Error(RESPONSES.CLINIC_SUB_TREATMENT_ERROR);
                        subTreatmentError.status = 400;

                        return callback(subTreatmentError);
                    }

                    callback();

                })
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
                })

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
        web_address: ['isString']

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
        web_address: ['isString']
    }, self.checkFunctions);

    this.createHospitalByOptions = function (options, settings, callback) {

        self.checkCreateHospitalOptions.run(options, settings, function (errors, validOptions) {

            if (errors) {
                return callback(errors)
            }

            createHospital(validOptions, function (err, hospitalId) {

                async.parallel([
                    async.apply(createHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(createHospitalSubTreatment, options.sub_treatments, hospitalId)

                ], function (err) {

                    if (err) {

                        self.deleteHospital(hospitalId, function () {
                                return callback(err);
                            })
                    }

                    callback(null, hospitalId);
                })
            })

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

                async.parallel([
                    async.apply(updateHospitalTreatment, options.treatment_ids, hospitalId),
                    async.apply(updateHospitalSubTreatment, options.sub_treatments, hospitalId)

                ], function (err) {

                    if (err) {
                        return callback(err);
                    }

                    callback(null, hospitalId);
                })

            })


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