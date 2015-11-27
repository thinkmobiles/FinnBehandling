app.controller('updateAdvertisementController', ['$scope', '$routeParams', '$location', 'AdvertisementsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, AdvertisementsManager, GeneralHelpers) {
        var self = this;
        var advertisementId = $routeParams.id;

        self.advertisement = {};

        self.updateAdvertisement = updateAdvertisement;
        self.getAdvertisement = getAdvertisement;
        self.cropResult = cropResult;
        self.checkImageType = checkImageType;
        self.removeImage = removeImage;





        function getAdvertisement () {

            AdvertisementsManager.getOneAdvertisement(advertisementId, function (err, advertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.advertisement = advertisement;
                self.oldImage = advertisement.image;
            });
        }

        getAdvertisement();

        function updateAdvertisement() {

            AdvertisementsManager.updateAdvertisement(advertisementId, self.advertisement, function (err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert("Advertisement successfully updated");

                $location.path('anonser');
            });
        }

        function cropResult (croppedImageBase64, type) {
            self.advertisement[type] = croppedImageBase64;
        }

        function checkImageType (name) {
            var imageContent = self[name];

            /*if (!imageContent) {
             return;
             }

             Client.checkFileType(imageContent, function (err, response) {
             if (err) {
             self.removeImage(name);
             return ErrMsg.show({message: err.data.error, status: err.status});
             }

             if (!response.validImage) {
             self.removeImage(name);
             return alert ('File is not image');
             }
             });*/
        }

        function removeImage(name) {
            self.advertisement[name] = null;
            self[name] = null;
            $('#' + name).val(null);
            $( '#' + name + '-slider').slider('disable');
        }
    }]);