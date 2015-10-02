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

        function getHospitals () {
            var behandling = GeneralHelpers.getLocalData('behandling');
            var fylke = GeneralHelpers.getLocalData('fylke');
            var tekstsok = GeneralHelpers.getLocalData('tekstsok');
            var resultater = GeneralHelpers.getLocalData('resultater');

            HospitalManager.getHospitalsList(function(err, hospitals) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = hospitals.length;
                self.hospitals = hospitals;
            });
        }

        getHospitals();
}]);