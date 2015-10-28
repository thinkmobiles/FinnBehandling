app.controller('behandlingstilbudController', ['$scope', 'HospitalManager', 'GeneralHelpers',
    function ($scope, HospitalManager, GeneralHelpers) {
        var self = this;

        $scope.hospitalPage = GeneralHelpers.getLocalData('hospitalPage') || 1;
        $scope.resultater = 10;

        this.setCoordinates = function (lat, long) {
            $scope.$parent.coordinates = {
                latitude: lat,
                longitude: long
            };
        };

        function getHospitalsCount () {
            var fylke = GeneralHelpers.getLocalData('fylke');
            var textSearch = GeneralHelpers.getLocalData('tekstsok');

            var searchData = {
                fylke: fylke,
                textSearch: textSearch
            };

            HospitalManager.getHospitalsCount(searchData, function(err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
                $scope.noHospitalsFound = result.count === '0';
            });
        }

        getHospitalsCount();

        this.refreshHospitals = function () {
            if (!$scope.$parent.searchResponse) {
                GeneralHelpers.saveAsLocalData('hospitalPage', $scope.hospitalPage);
            }

            getHospitals();
        };

        function getHospitals () {
            var behandling = GeneralHelpers.getLocalData('behandling');
            var fylke = GeneralHelpers.getLocalData('fylke');
            var textSearch = GeneralHelpers.getLocalData('tekstsok');

            var searchData = {
                limit: $scope.resultater,
                page: $scope.hospitalPage,
                fylke: fylke,
                textSearch: textSearch
            };

            $scope.pending = true;

            HospitalManager.getHospitalsList(searchData, function(err, hospitals) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;

                if ($scope.$parent) {
                    $scope.$parent.searchResponse = false;
                }

                self.hospitals = hospitals;
            });
        }

        getHospitals();
}]);