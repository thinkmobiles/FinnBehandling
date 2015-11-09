app.controller('newAdvertisementController', ['$scope', '$routeParams', '$location', 'AdvertisementsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, AdvertisementManager, GeneralHelpers){
        var self = this;

        this.createAdvertisement = function () {

            AdvertisementManager.createAdvertisement(self.advertisement, function (err, adveertisement) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert(' Advertisement successfully created');

                $location.path('anonser');
            });
        };
    }]);