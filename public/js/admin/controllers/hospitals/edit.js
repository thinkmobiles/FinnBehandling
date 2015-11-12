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
        self.resetFields = resetFields;
        self.updateForm = updateForm;

        self.hospital = {};
        self.hospital.is_paid = false;
        self.hospital.treatment_ids = [];
        self.hospital.sub_treatments = [];

        self.isSubTreatmentOpen = false;
        self.isMouseOverSubTreatment = true;


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
                self.subTreatments = treatment.subTreatments;
                self.hospital.treatment_ids.push(treatment.id);
                openTreatmentDialog();
            } else {
                self.isSubTreatmentOpen = false;
                var index = self.hospital.treatment_ids.indexOf(treatment.id);
                if (index >= 0) {
                    self.hospital.treatment_ids.splice(index, 1);
                }
                for (var i = treatment.subTreatments.length - 1; i >= 0; i--) {
                    treatment.subTreatments[i].isSelected = false;
                    self.hospital.sub_treatments.splice(self.hospital.sub_treatments.indexOf(treatment.subTreatments[i].id), 1);
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
                var index = self.hospital.sub_treatments.indexOf(subTreatment.id);
                if (index >= 0) {
                    self.hospital.sub_treatments.splice(index, 1);
                }
            }
        }


        /**
         * Set default values for the form
         */
        function resetFields() {
            self.hospital = {};
            self.hospital.is_paid = false;
            self.hospital.treatment_ids = [];
            self.hospital.sub_treatments = [];
            updateForm();
        }

        function updateForm() {

            if (!self.hospital.treatment_ids) {
                self.hospital.treatment_ids = [];
            }
            if (!self.hospital.sub_treatments) {
                self.hospital.sub_treatments = [];
            }

            for (var i = self.treatments.length - 1; i >= 0; i--) {
                if (self.hospital.treatment_ids && self.hospital.treatment_ids.indexOf(self.treatments[i].id) >= 0) {
                    self.treatments[i].isSelected = true;

                    for (var j = self.treatments[i].subTreatments.length - 1; j >= 0; j--) {
                        if (self.hospital.sub_treatments && self.hospital.sub_treatments.indexOf(self.treatments[i].subTreatments[j].id) >= 0) {
                            self.treatments[i].subTreatments[j].isSelected = true;
                        }
                    }
                }
            }
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

            var data = {
                is_paid: self.hospital.is_paid,
                name: self.hospital.name,
                treatment_ids: self.hospital.treatment_ids,
                sub_treatments: self.hospital.sub_treatments,
                description: self.hospital.description,
                email: self.hospital.email,
                phone_number: self.hospital.phone_number,
                web_address: self.hospital.web_address,
                postcode: self.hospital.postcode
            };

            if (!data.sub_treatments) {
                alert('Spesifiser hovedkategori');
                return;
            }

            HospitalsManager.createHospital(data, function (err, hospital) {
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
                for (var i = self.treatments.length - 1; i >= 0; i--) {
                    getSubTreatments(self.treatments[i]);
                }
            });
        }());

        function getSubTreatments(treatment) {

            TreatmentsManager.getSubTreatments(treatment.id, function (err, subTreatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                treatment.subTreatments = subTreatments;
            });
        }


        (function getHospitals() {

            HospitalsManager.getHospitalsList({},
                function (err, hospitals) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    self.hospitals = hospitals;
                    console.log(self.hospitals);
                });
        }());

        this.refreshHospitals = function () {
            GeneralHelpers.saveAsLocalData('hospitalsPage', $scope.hospitalsPage);

            getHospitals();
        };

        function getHospitalsCount() {

            HospitalsManager.getHospitalsCount({}, function (err, count) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

    }]);