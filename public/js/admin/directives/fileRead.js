app.directive('fileread', ['$timeout', function ($timeout) {
    return {
        restrict: "A",
        require: 'ngModel',
        scope: {
            extension: '=',
            maxsize: '@',
            cropResult: '=',
            imgWidth: '@',
            imgHeight: '@'
        },
        link: function (scope, element, attributes, controller) {
            scope.type = attributes.id;
            scope.process = true;
            var fileSize = typeof scope.maxsize !== 'undefined' ? scope.maxsize : 5000000;

            function makeErrorMessage(sizeIsValid, extensionIsValid, isImage, extension) {
                var _errorMessage;

                if (!isImage) {
                    return 'File is not image';
                }

                if (!sizeIsValid) {
                    _errorMessage = 'File is too big';

                    _errorMessage += !extensionIsValid
                        ? ' and not ' + extension
                        : '';

                } else if (!extensionIsValid) {

                    _errorMessage = 'File is not ' + extension;
                }

                return _errorMessage;
            }

            function getRotateDegree (imageData) {
                var bin = atob(imageData.split(',')[1]);

                var exif = EXIF.readFromBinaryFile(new BinaryFile(bin));

                switch(exif.Orientation){
                    case 8:
                        return -90;
                    case 3:
                        return 180;
                    case 6:
                        return 90;
                }

                return 0;
            }

            function fixImageOrientation (imageData, callback) {

                var canvas = document.createElement('canvas');
                var context = canvas.getContext('2d');
                var img = new Image();

                var drawImageWidth;
                var drawImageHeight;
                var biggestSide;

                var degree = getRotateDegree(imageData);

                if (!degree) {
                    return callback();
                }

                img.src = imageData;

                biggestSide = Math.max(img.height, img.width);

                if (Math.abs(degree) === 90) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                }

                if (img.width > img.height) {
                    drawImageHeight = degree === -90 ? -img.width / 2 : (Math.ceil(img.width - (img.height * 2))) / 2;
                    drawImageWidth = -img.width / 2;

                } else if (img.width < img.height) {
                    drawImageWidth = degree === 90 ? -img.height / 2 : (img.height - (img.width * 2)) / 2;
                    drawImageHeight = -img.height / 2;

                } else {
                    drawImageWidth = -img.width / 2;
                    drawImageHeight = -img.height / 2;
                }

                img.onload = function () {
                    context.translate(biggestSide / 2, biggestSide / 2);
                    context.rotate(degree * Math.PI / 180);
                    context.drawImage(this, drawImageWidth,  drawImageHeight);

                    imageData = canvas.toDataURL();

                    callback(imageData);
                    scope.$apply();
                };
                scope.$apply();
            }

            element.bind("change", function (changeEvent) {
                var fileType = changeEvent.target.files[0].type;

                var container = element.parent();
                var imageElement = container.find('img');
                //var zoomSliderElement = $( '#' + scope.type + '-slider' );
                var domElementSlider = document.getElementById(scope.type + '-slider');
                var zoomSliderElement = angular.element(domElementSlider);
                var isSliderInvoked;

                var sizeIsValid = changeEvent.target.files[0].size < fileSize;
                var isImage = fileType.indexOf('image') !== -1;
                var extensionIsValid = scope.extension ? scope.extension.indexOf(fileType) !== -1 : true;

                var errorMessage = makeErrorMessage(sizeIsValid, extensionIsValid, isImage, scope.extension);

                var imageIsValid = sizeIsValid && extensionIsValid && isImage;

                var reader = new FileReader();

                reader.onload = function (loadEvent) {
                    var imageData;

                    if (!imageIsValid) {
                        controller.$setViewValue(null);
                        element[0].value = null;
                        return alert(errorMessage);
                    }

                    imageData = loadEvent.target.result;

                    fixImageOrientation(imageData, function (modifiedImageData) {
                        if (modifiedImageData) {
                            imageData = modifiedImageData;
                        }

                        controller.$setViewValue(imageData);

                        if (fileType === "image/svg+xml") {
                            fileType = "image/svg";
                        }

                        imageElement.cropbox({
                            width: scope.imgWidth ? scope.imgWidth : container.width(),
                            height: scope.imgHeight ? scope.imgHeight : container.height(),
                            showControls: 'never'
                        }, function () {
                            var self = this;
                            var minValue;

                            if (this.minPercent < 1) {
                                isSliderInvoked = true;
                                minValue = self.minPercent * 100;

                                zoomSliderElement.slider({
                                    orientation: 'vertical',
                                    range: 'min',
                                    min: minValue,
                                    max: 100,
                                    value: 0,
                                    disabled: false,
                                    slide: function (event, ui) {
                                        var zoomValue = ui.value / 100;
                                        self.zoom(zoomValue);
                                    }
                                });
                            }
                        }).on('cropbox', function (e, data, img) {
                            var newZoomValue = img.percent * 100;
                            var croppedImageBase64 = img.getDataURL();

                            if (isSliderInvoked && img.minPercent < 1) {
                                zoomSliderElement.slider('value', newZoomValue);
                            }

                            scope.cropResult(croppedImageBase64, scope.type);
                        });
                    });
                };

                if (changeEvent.target.files[0]) {
                    reader.readAsDataURL(changeEvent.target.files[0]);
                }
            });
        }
    }
}]);