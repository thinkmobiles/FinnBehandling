app.controller('sentereController', ['$scope', 'HospitalManager', 'GeneralHelpers',
    function ($scope, HospitalManager, GeneralHelpers) {
        var self = this;

        $scope.curPage = 1;
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

        this.getHospitals = function () {
            var behandling = GeneralHelpers.getLocalData('behandling');
            var fylke = GeneralHelpers.getLocalData('fylke');
            var tekstsok = GeneralHelpers.getLocalData('tekstsok');
            var resultater = GeneralHelpers.getLocalData('resultater');

            HospitalManager.getHospitalsList({limit: resultater, page: $scope.curPage}, function(err, hospitals) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.hospitals = hospitals;
            });
        };

        this.getHospitals();
}]);