var Images = function (db) {

    var TABLES = require('../constants/tables');
    var Image = db.Models[TABLES.IMAGES];
    var responseMessages = require('../constants/responseMessages');
    var IMAGE_FOLDER = 'images';
    var imageUploaderConfig = {
        type: 'FileSystem',
        directory: process.env.LOCAL_IMAGE_STORAGE
    };
    var imageUploader = require('./imageUploader/imageUploader')(imageUploaderConfig);

    var self = this;

    function createName(option) {

        var random = Math.floor((Math.random() * 1000));
        var imageName = option + '_' + new Date().getTime() + '_' + random;

        return imageName;
    }

    this.newImage = function (options, callback) {

        if (!(options.imageUrl && options.imageable_id && options.imageable_type)) {

            if (callback && (typeof callback === 'function')) {
                return callback({error: responseMessages.NOT_ENOUGH_PARAMETERS});
            }
        }

        var newImageParams = prepareImageParams(options);
        newImageParams.name = createName(options.imageable_type);

        imageUploader.uploadImage(options.imageUrl, newImageParams.name, IMAGE_FOLDER,
            function (err, saveImageName) {
                if (err) {
                    if (callback && (typeof callback === 'function')) {
                        callback(err);
                    }
                    return;
                }
                newImageParams.name = saveImageName;
                Image
                    .forge()
                    .save(newImageParams)
                    .then(function (image) {
                        if (callback && (typeof callback === 'function')) {
                            callback(null, image);
                        }
                    })
                    .otherwise(function (err) {
                        if (callback && (typeof callback === 'function')) {
                            callback(err);
                        }
                    });
            });
    };

    this.duplicateImage = function (options, callback) {

        if (!(options.imageUrl && options.imageable_id && options.imageable_type)) {
            if (callback && (typeof callback === 'function')) {
                callback({error: responseMessages.NOT_ENOUGH_PARAMETERS});
                return;
            }
        }

        var newImageParams = prepareImageParams(options);
        newImageParams.name = createName(options.imageable_type);

        imageUploader.duplicateImage(options.imageUrl, newImageParams.name, IMAGE_FOLDER,
            function (err, saveImageName) {
                if (err) {
                    if (callback && (typeof callback === 'function')) {
                        callback(err);
                    }
                    return;
                }
                newImageParams.name = saveImageName;
                Image
                    .forge()
                    .save(newImageParams)
                    .then(function (image) {
                        if (callback && (typeof callback === 'function')) {
                            callback(null, image);
                        }
                    })
                    .otherwise(callback);
            });
    };

    function prepareImageParams(options) {
        var imageParams = {
            name: options.name,
            imageable_type: options.imageable_type,
            imageable_id: options.imageable_id
        };

        if (options.imageable_field) {
            imageParams.imageable_field = options.imageable_field;
        }

        return imageParams;
    }


    this.deleteImage = function (imageId, callback) {
        if (!imageId) {
            if (callback && (typeof callback === 'function')) {
                callback({error: responseMessages.NOT_ENOUGH_PARAMETERS});
            }
            return;
        }

        Image
            .forge({id: imageId})
            .fetch()
            .then(function (model) {
                if (model && model.id) {
                    imageUploader.removeImage(model.attributes['name'], IMAGE_FOLDER, function (err) {
                        if (err) {
                            if (callback && (typeof callback === 'function')) {
                                callback(err);
                            }
                            return;
                        }

                        model
                            .destroy()
                            .then(function () {
                                if (callback && (typeof callback === 'function')) {
                                    callback(null, imageId);
                                }
                            })
                            .otherwise(callback);

                    })
                }
            })
            .otherwise(callback);
    };


    this.updateImage = function (imageId, imageData, callback) {
        Image
            .forge({id: imageId})
            .fetch()
            .then(function (model) {
                if (model && model.id) {
                    removePreviousAndCreateImage(model, imageData, callback);
                }
            })
            .otherwise(callback)
    };

    this.updateOrCreateImageByClientProfileId = function (imageParams, callback) {
        Image
            .where({
                imageable_id: imageParams.imageable_id,
                imageable_field: imageParams.imageable_field
            })
            .fetch()
            .then(function (model) {
                if (model && model.id) {
                    removePreviousAndCreateImage(model, imageParams.imageUrl, callback);
                } else {
                    self.newImage(imageParams, callback);
                }
            })
            .otherwise(callback)
    };

    function removePreviousAndCreateImage(model, imageData, callback) {
        var imageInfo = model.toJSON();
        imageUploader.removeImage(imageInfo.name, IMAGE_FOLDER, function (err) {
            if (err) {
                if (callback && (typeof callback === 'function')) {
                    callback(err);
                }
                return;
            }

            var newImageName = createName(imageInfo.imageable_type);
            imageUploader.uploadImage(
                imageData,
                newImageName,
                IMAGE_FOLDER,
                function (err, saveImageName) {
                    if (err) {
                        if (callback && (typeof callback === 'function')) {
                            callback(err);
                        }
                        return;
                    }
                    onUpdateUploadedImage(saveImageName, model, callback)
                });
        });
    }

    function onUpdateUploadedImage(saveImageName, model, callback) {
        model
            .save(
            {name: saveImageName},
            {patch: true})
            .then(function (model) {
                if (callback && (typeof callback === 'function')) {
                    callback(null, model);
                }
            })
            .otherwise(callback);
    }

    this.getBase64ImageFromUrl = function(url, callback) {
        imageUploader.getBase64ImageFromUrl(url, callback);
    }
};

module.exports = Images;