app.controller('hospitalController', ['$scope', '$routeParams', '$location', 'HospitalManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, HospitalManager, GeneralHelpers) {
        var self = this;
        var hospitalId = $routeParams.id;

        $location.hash('main-menu');

        function getHospital () {

            HospitalManager.getHospital(hospitalId, function(err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.hospital = hospital;
            });
        }

        getHospital();
    }]);