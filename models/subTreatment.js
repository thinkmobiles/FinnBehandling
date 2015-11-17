var TABLES = require('../constants/tables');
var async = require('async');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.SUB_TREATMENTS
    }, {
        create: function (subTreatmentIds, hospitalId, callback) {

            var self = this;

            assert(callback);

            async.eachSeries(subTreatmentIds, function (subTreatmentId, innerCallback) {

                self.forge()
                    .save({
                        hospital_id: hospitalId,
                        sub_treatment_id: subTreatmentId
                    }, {
                        require: true
                    })
                    .asCallback(innerCallback);
            }, callback);
        },

        update: function (subTreatmentIds, hospitalId, callback) {

            var self = this;

            assert(callback);

            this.forge()
                .where({
                    hospital_id: hospitalId
                })
                .destroy()
                .asCallback(function (err) {

                    if (err) {
                        return callback(err);
                    }

                    async.eachSeries(subTreatmentIds, function (subTreatmentId, innerCallback) {

                        self
                            .forge()
                            .save({
                                hospital_id: hospitalId,
                                sub_treatment_id: subTreatmentId
                            }, {
                                require: true
                            })
                            .asCallback(innerCallback);

                    }, callback);
                });
        }
    });
};