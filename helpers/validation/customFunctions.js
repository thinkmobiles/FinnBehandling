var TABLES = require('../../constants/tables');
var RESPONSES = require('../../constants/responseMessages');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (postGre) {

    return {
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

            postGre.Models[TABLES.HOSPITALS].where(function () {
                this.where('name', validatedOptions.name).andWhereNot('id', options.id)
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