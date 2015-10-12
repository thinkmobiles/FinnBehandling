var TABLES = require('../constants/tables');
var imageUploaderConfig = {
    type: 'FileSystem',
    directory: 'public'
};
var imageUploader = require('../helpers/imageUploader/imageUploader')(imageUploaderConfig);

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
    });

    function deleteNewsImage (hospitalId) {

        postGre.Models[TABLES.IMAGES]
            .where({
                imageable_id: hospitalId,
                imageable_type: TABLES.NEWS,
                imageable_field: 'image'
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
