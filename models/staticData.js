var TABLES = require('../constants/tables');
var Validation = require('../helpers/validation/main');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (postGre, ParentModel) {

    return ParentModel.extend({
        tableName: TABLES.STATIC_DATA
    }, {
        update: {
            text: ['required', 'isString']
        },

        getValidated: function (validatePurpose, options, callback) {
            var checkValidatePurpose = validatePurpose === 'create' || validatePurpose === 'update';
            var validationParams = checkValidatePurpose ? this[validatePurpose] : {withoutValidation: true};

            validation(validationParams).run(options, callback);
        },

        updateValid: function (options, callback) {

            var self = this;

            assert(callback);

            this.getValidated('update', options, function (err, validOptions) {

                if (err) {
                    return callback(err)
                }

                self.forge({id: 1})
                    .save(validOptions, {method: 'update', require: true})
                    .asCallback(callback);
            });
        }
    });

    function validation (options) {
        return new Validation.Check(options);
    }
};
