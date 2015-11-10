app.controller('editHospitalController', ['$scope', '$routeParams', '$location', 'HospitalsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, HospitalsManager, GeneralHelpers) {
        var self = this;
        var hospitalId = $routeParams.id;
        self.hospital = {};

        this.createHospital = function () {

            HospitalsManager.createHospital(self.hospital, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital created successful');

                $location.path('');
            });
        };

        function getHospital () {

            HospitalsManager.getHospital(hospitalId, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.hospital = hospital;
            });
        }

        if (hospitalId) {
            getHospital ();
        }

        this.updateHospital = function () {

            HospitalsManager.createHospital(hospitalId, self.hospital, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital updated successful');

                $location.path('');
            });
        };
    }]);