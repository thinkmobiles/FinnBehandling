var TABLES = require('../constants/tables');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (PostGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.HOSPITAL_TYPES_LIST
    }, {
        isExistsValidate: function (options, validatedOptions, callback) {
            assert(callback);

            this.forge({
                    id: validatedOptions.type_id
                })
                .fetch({
                    require: true
                })
                .asCallback(callback);
        }
    });
};