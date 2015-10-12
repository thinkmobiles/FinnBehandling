var TABLES = require('../constants/tables');
var imageUploaderConfig = {
    type: 'FileSystem',
    directory: 'public'
};
var imageUploader = require('../helpers/imageUploader/imageUploader')(imageUploaderConfig);

module.exports = function (postGre, ParentModel) {

    return ParentModel.extend({
        idAttribute: 'id',
        hasTimestamps: true,
        tableName: TABLES.HOSPITALS,

        logo: function () {
            return this.morphOne(postGre.Models[TABLES.IMAGES], 'imageable');
        },

        initialize: function () {
            this.on('destroying', this.removeAllDependencies);
        },

        removeAllDependencies: function (model) {

            deleteHospitalLogo(model.id);
        }
    });

    function deleteHospitalLogo (hospitalId) {

        postGre.Models[TABLES.IMAGES]
            .where({
                imageable_id: hospitalId,
                imageable_type: TABLES.HOSPITALS,
                imageable_field: 'logo'
            })
            .fetch()
            .then(function (model) {

                imageUploader.removeImage(model.attributes['name'], 'images', function (err) {

                    if (!err) {

                        model
                            .destroy()
                            .asCallback();
                    }
                });
            });
    }
};