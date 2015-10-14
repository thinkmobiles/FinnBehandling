var TABLES = require('../constants/tables');
var RESPONSES = require('../constants/responseMessages');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.TREATMENTS_LIST
    }, {
        isExistsValidate: function (options, validatedOptions, callback) {

            assert(callback);

            this.query(function (qb) {
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
        }
    });
};