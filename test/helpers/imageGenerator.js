var imageUploaderConfig = {
    type: 'FileSystem',
    directory: process.env.LOCAL_IMAGE_STORAGE
};
var uploadImage = require('../../helpers/imageUploader/imageUploader')(imageUploaderConfig).uploadImage;
var imageFixtures = require('../db/base64Fixtures/images');
var async = require('async');

module.exports = function (relationData, relationName, imageType, factory, callback) {
    var result = [];

    async.each(relationData, function (relationObject, callback) {

        var imageName = createName(relationName);

        var imagesData = imageFixtures[relationName];
        var imageIndex = randomFrom(imagesData.length);

        uploadImage(imagesData[imageIndex], imageName, 'images', function (err, imageName) {
            if (err) {
                return callback(err);
            }

            var imageParams = {
                name: imageName,
                imageable_id: relationObject.id,
                imageable_type: relationName,
                imageable_field: imageType
            };

            factory.create('image', imageParams, function (err, image) {
                if (err) {
                    return callback(err);
                }

                result.push(image);

                callback();
            });
        });
    }, function (err) {
        if (err) {
            return callback(err);
        }

        return callback(null, result);
    });
};



function createName(option) {

    return 'fixture_' + option + '_' + new Date().getTime() + '_' + randomFrom(1000);
    //return option + '_' + new Date().getTime() + '_' + randomFrom(1000);
}

function randomFrom (number) {

    return Math.floor((Math.random() * number));
}