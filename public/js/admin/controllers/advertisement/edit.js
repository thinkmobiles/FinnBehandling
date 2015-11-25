app.controller('editAdvertisementController', ['$scope', '$routeParams', '$location', 'AdvertisementsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, AdvertisementsManager, GeneralHelpers) {
        var self = this;
        var advertisementId = $routeParams.id;

        self.saveAdvertisement = saveAdvertisement;

        self.pageTitle = 'Create advertisement';
        self.advertisement = {};


        function getAdvertisement() {
            if (advertisementId) {
                AdvertisementsManager.getOneAdvertisement(advertisementId, function (err, advertisement) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    self.advertisement = advertisement;
                    self.pageTitle = 'Update advertisement';
                    self.old_logo = advertisement.image;
                });
            }
        }

        getAdvertisement();

        function saveAdvertisement() {
            if (advertisementId) {
                updateAdvertisement();
            } else {
                createAdvertisement();
            }
        }


        function updateAdvertisement() {

            AdvertisementsManager.updateAdvertisement(advertisementId, self.advertisement, function (err, advertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert("Advertisement successfully updated");

                $location.path('anonser');
            });

        }

        function createAdvertisement() {

            AdvertisementsManager.createAdvertisement(self.advertisement, function (err, adveertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert(' Advertisement successfully created');

                $location.path('anonser');
            });
        }



    }]);