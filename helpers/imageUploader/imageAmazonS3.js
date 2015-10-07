var imageUploader = (function (awsConfig) {
    "use strict";

    var AWS = require('aws-sdk');
    var amazonS3 = awsConfig;
    var s3 = new AWS.S3({ httpOptions: { timeout: 50000 } });
    var s3policy = require('s3policy');
    var request = require('request');

    function encodeFromBase64(dataString, callback) {
        if (!dataString) {
            callback({error: 'Invalid input string'});
            return;
        }

        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        var imageData = {};

        if (!matches || matches.length !== 3) {
            try {
                imageData.type = 'image/png';
                imageData.data = new Buffer(dataString, 'base64');
                imageData.extention = 'png';
            } catch (err) {
                callback({error: 'Invalid input string'});
                return;
            }
        } else {
            imageData.type = matches[1];
            imageData.data = new Buffer(matches[2], 'base64');

            var imageTypeRegularExpression = /\/(.*?)$/;
            var imageTypeDetected = imageData
                .type
                .match(imageTypeRegularExpression);

            imageData.extention = imageTypeDetected[1];
        }

        callback(null, imageData);
    }

    function uploadImage(imageData, imageName, folder, callback) {
        encodeFromBase64(imageData, function (err, imageData) {
            if (err) {
                if (callback && (typeof callback === 'function')) {
                    callback(err);
                }
                return;
            }
            var imageNameWithExt = imageName + '.' + imageData.extention;
            putObjectToAWS(folder, imageNameWithExt, imageData.data, function (err, imageUrl) {
                if (callback && (typeof callback === 'function')) {
                    callback(err, imageNameWithExt);
                }
            });
        });
    };

    function putObjectToAWS(bucket, key, body, callback) {
        s3.putObject({ Bucket: bucket, Key: key, Body: body }, function (err, data) {
            if (callback && (typeof callback === 'function')) {
                callback(err, data);
            }
        });
    };

    function removeImage(imageName, folder, callback) {
        removeObjectFromAWS(folder, imageName, function (err, imageUrl) {
            if (callback && (typeof callback === 'function')) {
                callback(err, imageUrl);
            }
        });
    };

    function removeObjectFromAWS(bucket, name, callback) {
        var params = {
            Bucket: bucket,
            Key: name
        };
        s3.deleteObject(params, function (err, data) {
            if (callback && typeof callback === 'function') {
                callback(err, data);
            }
        });
    };

    function getImageUrl(name, folder) {
        return getObjectUrlFromAmazon(name, folder);
    };

    function getObjectUrlFromAmazon(name, bucket) {
        var myS3Account = new s3policy(amazonS3.accessKeyId, amazonS3.secretAccessKey);
        return myS3Account.readPolicy(name, bucket, amazonS3.imageUrlDurationSec);
    };

    function getBase64ImageFromUrl(url, callback) {
        var requestObj = request.defaults({encoding: null});

        requestObj.get(url, function (err, res, body) {
            if (err) {
                return callback(err);
            }

            var ext = url.slice(url.lastIndexOf('.') + 1);
            var base64Image = body.toString('base64');
            base64Image = 'data:image/' + ext + ';base64,' + base64Image;
            callback(null, base64Image);
        });
    }

    return {
        uploadImage: uploadImage,
        removeImage: removeImage,
        getImageUrl: getImageUrl,
        getBase64ImageFromUrl:getBase64ImageFromUrl
    };

})();

module.exports = imageUploader;