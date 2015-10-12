var TABLES = require('../constants/tables');

module.exports = function (postGre, ParentModel) {
    var IMAGE_FOLDER = 'images';
    var imageUploaderConfig = {
        type: 'FileSystem',
        directory: 'public'
    };
    var imageUploader = require('../helpers/imageUploader/imageUploader')(imageUploaderConfig);

    return ParentModel.extend({
        tableName: TABLES.IMAGES,


        toJSON: function () {
            var attributes = postGre.Model.prototype.toJSON.call(this);
            if (attributes.id) {
                attributes['image_url'] = imageUploader.getImageUrl(attributes.name, IMAGE_FOLDER);
            }
            return attributes;
        },

        imageable: function() {
            return this.morphTo('imageable',
                postGre.Models[TABLES.HOSPITALS],
                postGre.Models[TABLES.NEWS]);
        }
    });
};