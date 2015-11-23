app.controller('advertisementsController', ['$scope', 'AdvertisementsManager', 'GeneralHelpers',
    function ($scope, AdvertisementsManager, GeneralHelpers) {
        var self = this;

        $scope.advertisementsPage = GeneralHelpers.getLocalData('advertisementsPage') || 1;
        $scope.resultater = 10;

        function getAdvertisementsCount () {

            AdvertisementsManager.getAdvertisementsCount(function (err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

        getAdvertisementsCount();

        this.refreshAdvertisements = function () {
            GeneralHelpers.saveAsLocalData('advertisementsPage', $scope.advertisementsPage);

            getAdvertisements();
        };

        function getAdvertisements () {

            $scope.pending = true;

            AdvertisementsManager.getAdvertisements({limit: $scope.resultater, page: $scope.advertisementsPage},
                function (err, advertisements) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    $scope.pending = false;
                    $scope.advertisements = advertisements;
                });
        }

        getAdvertisements();


        this.deleteAdvertisement = function (id) {

            AdvertisementsManager.removeAdvertisement(id, function (err) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Deleted successfully');

                getAdvertisements();

                getAdvertisementsCount();
            });
        };
    }]);