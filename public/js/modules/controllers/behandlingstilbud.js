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

        this.redirect = function (address) {
            if (address.indexOf('http') === -1) {
                address = 'http://' + address;
            }

            window.location.href = address;
        };

        function getHospitalsCount () {
            var fylke = GeneralHelpers.getLocalData('fylke');
            var textSearch = GeneralHelpers.getLocalData('tekstsok');
            var behandling = GeneralHelpers.getLocalData('behandling');
            var underkategori = GeneralHelpers.getLocalData('underkategori');

            var searchData = {
                fylke: fylke,
                textSearch: textSearch,
                treatment: behandling,
                subTreatment: underkategori
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
            var underkategori = GeneralHelpers.getLocalData('underkategori');
            var fylke = GeneralHelpers.getLocalData('fylke');
            var textSearch = GeneralHelpers.getLocalData('tekstsok');

            var searchData = {
                limit: $scope.resultater,
                page: $scope.hospitalPage,
                fylke: fylke,
                textSearch: textSearch,
                treatment: behandling,
                subTreatment: underkategori
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