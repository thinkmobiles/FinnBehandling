app.controller('editHospitalController', ['$scope', '$routeParams', '$location', 'HospitalsManager', 'TreatmentsManager', 'RegionsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, HospitalsManager, TreatmentsManager, RegionsManager, GeneralHelpers) {
        var self = this;
        self.hospitalId = $routeParams.id;

        self.persistHospital = persistHospital;
        self.createHospital = createHospital;
        self.updateHospital = updateHospital;

        self.getDescriptionMaxLength = getDescriptionMaxLength;
        self.changeTreatmentSelection = changeTreatmentSelection;
        self.changeSubTreatmentSelection = changeSubTreatmentSelection;
        self.closeTreatmentDialog = closeTreatmentDialog;
        self.setFormDirty = setFormDirty;
        self.resetFields = resetFields;
        self.updateForm = updateForm;
        self.getRegion = getRegion;
        self.cropResult = cropResult;
        self.checkImageType = checkImageType;
        self.removeImage = removeImage;

        self.isSubTreatmentOpen = false;
        self.isMouseOverSubTreatment = true;
        self.isFormDirty = false;


        getTreatments();
        resetFields();


        if (self.hospitalId) {
            getHospital(self.hospitalId);
        }


        /**
         * Check max length for currently selected entry type
         * @returns {number}
         */
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
            } else {
                var index = self.hospital.sub_treatments.indexOf(subTreatment.id);
                if (index >= 0) {
                    self.hospital.sub_treatments.splice(index, 1);
                }
            }

        }

        /**
         * Fill treatment_ids with data
         *
         * Converts subTreatments object array into int array
         * [Object, Object, Object] -> [1, 4, 9]
         *
         * @param hospital
         */
        function processSubTreatments(hospital) {
            self.hospital.treatment_ids = [];
            if (hospital.sub_treatments) {
                for (var i = hospital.sub_treatments.length - 1; i >= 0; i--) {
                    if (hospital.sub_treatments[i].treatment_id && self.hospital.treatment_ids.indexOf(hospital.sub_treatments[i].treatment_id) < 0) {
                        self.hospital.treatment_ids.push(hospital.sub_treatments[i].treatment_id);
                    }
                    self.hospital.sub_treatments[i] = hospital.sub_treatments[i].id;
                }
            }
        }


        /**
         * Set default values for the form
         */
        function resetFields() {
            self.hospital = {};
            self.hospital.phones = [{}, {}, {}];
            self.hospital.email = [];
            self.hospital.is_paid = false;
            self.hospital.treatment_ids = [];
            self.hospital.sub_treatments = [];
            self.isFormDirty = false;
            updateForm();
        }

        /**
         * Form validation initializer.
         * Once it's invoked invalid fields will be highlighted
         * @returns {boolean}
         */
        function setFormDirty() {
            self.isFormDirty = true;
            return self.isFormDirty;
        }


        /**
         * Do form fields set up routine.
         * Could be used for initialization or reinitialization
         */
        function updateForm() {

            getRegion();

            if (!self.hospital.treatment_ids) {
                self.hospital.treatment_ids = [];
            }
            if (!self.hospital.sub_treatments) {
                self.hospital.sub_treatments = [];
            }
            if (!self.treatments) {
                self.treatments = [];
            }

            for (var i = self.treatments.length - 1; i >= 0; i--) {

                if (self.hospital.treatment_ids && self.hospital.treatment_ids.indexOf(self.treatments[i].id) >= 0) {
                    self.treatments[i].isSelected = true;
                    if (self.treatments[i].subTreatments) {
                        for (var j = self.treatments[i].subTreatments.length - 1; j >= 0; j--) {
                            if (self.hospital.sub_treatments && self.hospital.sub_treatments.indexOf(self.treatments[i].subTreatments[j].id) >= 0) {
                                self.treatments[i].subTreatments[j].isSelected = true;
                            }
                        }
                    }
                }
            }

            if (self.hospital.phone_number) {
                self.hospital.phones = [{}, {}, {}];

                for (var i = self.hospital.phone_number.length - 1; i >= 0; i--) {
                    self.hospital.phones[i].prefix = self.hospital.phone_number[i].substring(0, 4);
                    self.hospital.phones[i].suffix = self.hospital.phone_number[i].substring(4);
                }
            }

        }


        /**
         * Changes indicator for treatment dialog
         */
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

        /**
         * Invoke either update hospital (if route params is present) or create ne one otherwise
         */
        function persistHospital() {
            if (self.hospitalId) {
                updateHospital();
            } else {
                createHospital();
            }
        }


        /**
         * Prepare object before db update
         * @returns {{region_id: *, is_paid: boolean, name: *, treatment_ids: Array, sub_treatments: Array, description: (string|*), email: *, phone_number: *, web_address: (*|string|Array|string|Document.web_address), postcode: *}}
         */
        function prepareData() {

            if(!self.hospital.phone_number){
                self.hospital.phone_number = [];
            }

            for (var i = self.hospital.phones.length - 1; i >= 0; i--) {
                if (self.hospital.phones[i].prefix && self.hospital.phones[i].suffix) {
                    self.hospital.phone_number[i] = self.hospital.phones[i].prefix + self.hospital.phones[i].suffix;
                }
            }

            var data = {
                region_id: self.hospital.region_id,
                is_paid: self.hospital.is_paid,
                name: self.hospital.name,
                treatment_ids: self.hospital.treatment_ids,
                sub_treatments: self.hospital.sub_treatments,
                description: self.hospital.description,
                email: self.hospital.email,
                phone_number: self.hospital.phone_number,
                web_address: self.hospital.web_address,
                postcode: self.hospital.postcode,
                address: self.hospital.address,
                logo: self.hospital.logo

            };

            return data;
        }

        /**
         * Persist hospital object
         */
        function createHospital() {

            var data = prepareData();


            HospitalsManager.createHospital(data, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital created successful');

                $location.path('');
            });
        }

        /**
         * Fetch hospital by its id
         * @param hospitalId
         */
        function getHospital(hospitalId) {

            HospitalsManager.getHospital(hospitalId, function (err, hospital) {
                if (err) {
                    self.hospitalId = null;
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.hospital = hospital;
                self.old_logo = hospital.logo;

                processSubTreatments(self.hospital);
                updateForm();

                if (!self.hospital.city && self.hospital.postcode) {
                    getRegion();
                }
            });
        }


        /**
         * Hospital update function, persist hospital object
         */
        function updateHospital() {

            var data = prepareData();


            HospitalsManager.updateHospital(self.hospitalId, data, function (err, hospital) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Hospital updated successful');

                $location.path('');
            });
        }

        /**
         * Fetch region by zip code
         */
        function getRegion() {
            if (self.hospital.postcode && self.hospital.postcode.length !== 4) {
                return;
            }

            RegionsManager.getFylkesByPostCode(self.hospital.postcode, function (err, region) {

                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.currentRegion = region;
                self.hospital.region_id = self.currentRegion.id;
                self.hospital.city = self.currentRegion.poststed ? self.currentRegion.poststed.substring(0, 1).toUpperCase() + self.currentRegion.poststed.substring(1).toLowerCase() : '';

            });
        }


        /**
         * Fetch treatments from db
         */
        function getTreatments() {

            TreatmentsManager.getTreatments(function (err, treatments) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.treatments = treatments;
                for (var i = self.treatments.length - 1; i >= 0; i--) {
                    getSubTreatments(self.treatments[i]);
                }
            });
        }

        /**
         * Fetch all subtreatments for specified treatment
         * @param treatment
         */
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
                });
        }());

        self.refreshHospitals = function () {
            GeneralHelpers.saveAsLocalData('hospitalsPage', $scope.hospitalsPage);

            getHospitals();
        };

        /**
         * Fetch hospital quantity
         */
        function getHospitalsCount() {

            HospitalsManager.getHospitalsCount({}, function (err, count) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.totalItems = result.count;
            });
        }

        function cropResult (croppedImageBase64, type) {
            self.hospital[type] = croppedImageBase64;
        }

        function checkImageType (name) {
            var imageContent = self[name];

            /*if (!imageContent) {
             return;
             }

             Client.checkFileType(imageContent, function (err, response) {
             if (err) {
             self.removeImage(name);
             return ErrMsg.show({message: err.data.error, status: err.status});
             }

             if (!response.validImage) {
             self.removeImage(name);
             return alert ('File is not image');
             }
             });*/
        }

        function removeImage(name) {
            self.hospital[name] = null;
            self[name] = null;
            $('#' + name).val(null);
            $( '#' + name + '-slider').slider('disable');
        }

    }]);