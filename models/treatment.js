var TABLES = require('../constants/tables');
var async = require('async');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        idAttribute: 'id',
        tableName: TABLES.TREATMENTS
    }, {


        create: function (treatmentIds, hospitalId, callback) {

            var self = this;

            assert(callback);

            async.eachSeries(treatmentIds, function (treatmentId, innerCallback) {

                self.forge()
                    .save({
                        hospital_id: hospitalId,
                        treatment_id: treatmentId
                    }, {
                        require: true
                    })
                    .asCallback(innerCallback)
            }, callback);
        },


        update: function (treatmentIds, hospitalId, callback) {

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

                    async.eachSeries(treatmentIds, function (treatmentId, innerCallback) {

                        self.forge()
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
    });
};