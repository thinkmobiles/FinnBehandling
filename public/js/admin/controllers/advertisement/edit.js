app.controller('updateAdvertisementController', ['$scope', '$routeParams', '$location', 'AdvertisementsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, AdvertisementsManager, GeneralHelpers) {
        var self = this;
        var advertisementId = $routeParams.id;

        function getAdvertisement () {

            AdvertisementsManager.getOneAdvertisement(advertisementId, function (err, advertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.advertisement = advertisement;
            });
        }

        getAdvertisement();

        this.updateAdvertisement = function () {

            AdvertisementsManager.updateAdvertisement(advertisementId, self.advertisement, function (err, advertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert("Advertisement successfully updated");

                $location.path('anonser');
            });
        };
    }]);