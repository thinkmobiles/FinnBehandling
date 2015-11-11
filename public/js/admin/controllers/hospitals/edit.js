app.controller('editHospitalController', ['$scope', '$routeParams', '$location', 'HospitalsManager', 'TreatmentsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, HospitalsManager, TreatmentsManager, GeneralHelpers) {
        var self = this;
        var hospitalId = $routeParams.id;

        self.createHospital = createHospital;
        self.updateHospital = updateHospital;

        self.getDescriptionMaxLength = getDescriptionMaxLength;
        self.changeTreatmentSelection = changeTreatmentSelection;
        self.changeSubTreatmentSelection = changeSubTreatmentSelection;
        self.closeTreatmentDialog = closeTreatmentDialog;

        self.hospital = {};
        self.hospital.is_paid = false;
        self.hospital.treatment_ids = [];
        self.hospital.sub_treatments = [];

        self.isSubTreatmentOpen = false;
        self.isMouseOverSubTreatment = true;

        $scope.resultater = 1000000;
        $scope.hospitalsPage = GeneralHelpers.getLocationData('hospitalsPage') || 1;

        function getDescriptionMaxLength() {
            if (self.hospital.description && !self.hospital.is_paid) {
                self.hospital.description = self.hospital.description.substring(0, 200);
            }
            return self.hospital.is_paid ? 600 : 200;
        }

        /**
         * Manage selected treatments depending on user selection
         * @param treatment
         */
        function changeTreatmentSelection(treatment) {
            if (treatment.isSelected) {
                getSubTreatments(treatment.id);
                self.hospital.treatment_ids.push(treatment.id);
                openTreatmentDialog();
            } else {
                self.isSubTreatmentOpen = false;
                self.hospital.treatment_ids = [];
                for (var i = self.treatments.length - 1; i >= 0; i--) {
                    if (self.treatments[i].isSelected) {
                        self.hospital.treatment_ids.push(self.treatments[i].id);
                    }
                }
            }
        }

        /**
         * Manage selected subTreatments depending on user selection
         * @param subTreatment
         */
        function changeSubTreatmentSelection(subTreatment) {
            if (subTreatment.isSelected) {
                self.hospital.sub_treatments.push(subTreatment.id);
                openTreatmentDialog();
            } else {
                self.hospital.sub_treatments = [];
                for (var i = self.subTreatments.length - 1; i >= 0; i--) {
                    if (self.subTreatments[i].isSelected) {
                        self.hospital.sub_treatments.push(self.subTreatments[i].id);
                    }
                }
            }
        }

        function resetFields() {
            self.hospital = {};
            self.hospital.is_paid = false;
            self.hospital.treatment_ids = [];
            self.hospital.sub_treatments = [];
        }

        function openTreatmentDialog() {
            self.isSubTreatmentOpen = true;
        }

        /**
         * Hide subTreatment selection dialog, only works if clicked outside of
         */
        function closeTreatmentDialog() {
            if (!self.isMouseOverSubTreatment) {
                self.subTreatments = [];
            }
        }

        function createHospital() {
            HospitalsManager.createHospital(self.hospital, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital created successful');

                $location.path('');
            });
        }

        function getHospital(hospitalId) {

            HospitalsManager.getHospital(hospitalId, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.hospital = hospital;
            });
        }

        if (hospitalId) {
            getHospital();
        }


        function updateHospital() {
            HospitalsManager.createHospital(hospitalId, self.hospital, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital updated successful');

                $location.path('');
            });
        }


        (function getTreatments() {

            TreatmentsManager.getTreatments(function (err, treatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.treatments = treatments;
            });
        }());

        function getSubTreatments(treatmentId) {

            TreatmentsManager.getSubTreatments(treatmentId, function (err, subTreatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.subTreatments = subTreatments;
            });
        }


        function getHospitals () {

            HospitalsManager.getHospitalsList({},
                function (err, hospitals) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    self.hospitals = hospitals;
                });
        }

        this.refreshHospitals = function () {
            GeneralHelpers.saveAsLocalData('hospitalsPage', $scope.hospitalsPage);

            getHospitals();
        };

        function getHospitalsCount () {

            HospitalsManager.getHospitalsCount({}, function (err, count) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

    }]);