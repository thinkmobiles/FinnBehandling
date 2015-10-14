var TABLES = require('../constants/tables');
var imageUploaderConfig = {
    type: 'FileSystem',
    directory: process.env.LOCAL_IMAGE_STORAGE
};
var removeImage = require('../helpers/imageUploader/imageUploader')(imageUploaderConfig).removeImage;
var Validation = require('../helpers/validation/main');

function assert(fn) {

    if (typeof fn !== 'function') {
        throw new Error(typeof fn + ' is not a function');
    }
}

module.exports = function (postGre, ParentModel) {

    return ParentModel.extend({
        hasTimestamps: true,
        tableName: TABLES.NEWS,

        image: function () {
            return this.morphOne(postGre.Models[TABLES.IMAGES], 'imageable');
        },

        removeAllDependencies: function (model) {

            deleteNewsImage(model.id);
        }
    }, {
        create: {
            subject: ['required', 'isString'],
            content: ['required', 'isString'],
            source: ['required', 'isString']
        },

        update: {
            id: ['required', 'isInt'],
            subject: ['required', 'isString'],
            content: ['required', 'isString'],
            source: ['required', 'isString']
        },

        getValidated: function (validatePurpose, options, callback) {
            var checkValidatePurpose = validatePurpose === 'create' || validatePurpose === 'update';
            var validationParams = checkValidatePurpose ? this[validatePurpose] : {withoutValidation: true};

            validation(validationParams).run(options, callback);
        },

        createValid: function (options, callback) {

            var self = this;

            assert(callback);

            this.getValidated('create', options, function (err, validOptions) {

                if (err) {
                    return callback(err)
                }

                self.forge()
                    .save(validOptions, {require: true})
                    .asCallback(callback);
            });
        },

        updateValid: function (options, callback) {

            var self = this;

            assert(callback);

            this.getValidated('update', options, function (err, validOptions) {

                if (err) {
                    return callback(err)
                }

                self.forge({id: options.id})
                    .save(validOptions, {method: 'update', require: true})
                    .asCallback(callback);
            });
        }
    });

    function validation (options) {
        return new Validation.Check(options);
    }

    function deleteNewsImage (hospitalId) {

        postGre.Models[TABLES.IMAGES]
            .fetchWhere({
                imageable_id: hospitalId,
                imageable_type: TABLES.NEWS,
                imageable_field: 'image'
            })
            .then(function (model) {

                removeImage(model.attributes['name'], 'images', function (err) {

                    if (!err) {

                        model
                            .destroy()
                            .asCallback();
                    }
                });
            });
    }
};
