var TABLES = require('../../constants/tables');
var RESPONSES = require('../../constants/responseMessages');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (postGre) {

    return {
        checkHospitalType: function (options, validatedOptions, callback) {
            assert(callback);

            postGre.Models[TABLES.HOSPITAL_TYPES_LIST].forge({
                id: validatedOptions.type_id
            })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        },
        checkHospitalRegion: function (options, validatedOptions, callback) {
            assert(callback);

            postGre.Models[TABLES.REGIONS_LIST].forge({
                id: validatedOptions.region_id
            })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        },
        checkHospitalTreatment: function (options, validatedOptions, callback) {

            assert(callback);

            postGre.Models[TABLES.TREATMENTS_LIST].query(function (qb) {
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

                });
        },
        checkHospitalSubTreatment: function (options, validatedOptions, callback) {

            assert(callback);

            postGre.Models[TABLES.SUB_TREATMENTS_LIST].query(function (qb) {
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

            assert(callback);

            postGre.Models[TABLES.HOSPITALS].forge({
                name: validatedOptions.name
            })
                .fetch()
                .asCallback(function (err, hospital) {
                    var nonUniqueNameError;

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

            postGre.Models[TABLES.HOSPITALS].forge({
                    id: validatedOptions.id
                })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        }
    };

};