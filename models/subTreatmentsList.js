var TABLES = require('../constants/tables');
var RESPONSES = require('../constants/responseMessages');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.SUB_TREATMENTS_LIST
    }, {
        isExistsValidate: function (options, validatedOptions, callback) {

            assert(callback);

            this.query(function (qb) {
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
        }
    });
};