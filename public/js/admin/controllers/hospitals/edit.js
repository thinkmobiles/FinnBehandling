app.controller('editHospitalController', ['$scope', '$routeParams', '$location', 'HospitalsManager', 'TreatmentsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, HospitalsManager, TreatmentsManager, GeneralHelpers) {
        var self = this;
        var hospitalId = $routeParams.id;

        self.getDescriptionMaxLength = getDescriptionMaxLength;

        self.hospital = {};
        self.hospital.is_paid = false;


        function getDescriptionMaxLength() {
            if (self.hospital.description && !self.hospital.is_paid) {
                self.hospital.description = self.hospital.description.substring(0, 200);
            }
            return self.hospital.is_paid ? 600 : 200;
        }

        self.createHospital = function () {
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


        self.updateHospital = function () {
            HospitalsManager.createHospital(hospitalId, self.hospital, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital updated successful');

                $location.path('');
            });
        };


        self.getTreatments = function () {

            TreatmentsManager.getTreatments(function (err, treatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.treatments = treatments;
            });
        };

        getTreatments();

         self.getSubTreatments = function () {

            TreatmentsManager.getSubTreatments(self.treatmentId, function (err, subTreatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.subTreatments = subTreatments;
            });
        };

    }]);