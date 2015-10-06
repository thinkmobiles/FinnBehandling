app.controller('behandlingstilbudController', ['$scope', 'HospitalManager', 'GeneralHelpers',
    function ($scope, HospitalManager, GeneralHelpers) {
        var self = this;

        $scope.curPage = GeneralHelpers.getLocalData('curPage') || 1;
        $scope.$parent.resultater = GeneralHelpers.getLocalData('resultater') || 25;

        this.setCoordinates = function (lat, long) {
            $scope.$parent.coordinates = {
                latitude: lat,
                longitude: long
            };
        };

        function getHospitalsCount () {
            HospitalManager.getHospitalsCount(function(err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

        getHospitalsCount();

        this.updateHospitals = function () {
            if (!$scope.$parent.searchResponse) {
                GeneralHelpers.saveAsLocalData('curPage', $scope.curPage);
            }

            getHospitals();
        };

        function getHospitals () {
            var behandling = GeneralHelpers.getLocalData('behandling');
            var fylke = GeneralHelpers.getLocalData('fylke');
            var tekstsok = GeneralHelpers.getLocalData('tekstsok');
            var resultater = GeneralHelpers.getLocalData('resultater');

            $scope.pending = true;

            HospitalManager.getHospitalsList({limit: resultater, page: $scope.curPage}, function(err, hospitals) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;
                $scope.$parent.searchResponse = false;

                self.hospitals = hospitals;
            });
        }

        getHospitals();
}]);