/**
 * Created by vasylhoshovsky on 17.11.15.
 */
app.controller('listHospitalController', ['$scope', 'HospitalsManager', 'RegionsManager', 'TreatmentsManager', 'GeneralHelpers',
    function ($scope, HospitalsManager, RegionsManager, TreatmentsManager, GeneralHelpers) {

        var vm = this;

        vm.fylkes = [];
        vm.chosenFylke = 'Alle';

        vm.categories = [];
        vm.chosenCategory = 'Alle';

        vm.searchText = '';

        vm.currentPage = 1;
        vm.resultCount = 5;
        vm.resultCountVariants = [5, 10, 25, 50, 100, 200];

        vm.hospitals = [];

        vm.search = search;
        vm.deleteHospital = deleteHospital;


        search();

        RegionsManager.getFylkes(function (err, data) {
            if (!err) {
                //console.log(data);
                vm.fylkes = data;
            }
        });

        TreatmentsManager.getTreatments(function (err, data) {
            if (!err) {
                vm.categories = data;
            }
        });

        /**
         * GET hospitals with applied filters
         */
        function search() {
            HospitalsManager.getHospitalsList(getFilters(), function (err, data) {
                if (!err) {
                    vm.hospitals = data;
                }
            });
        }

        /**
         * Prepare and return filter object for GET hospitals query
         * @returns {{}}
         */
        function getFilters() {
            var filters = {};

            filters.limit = vm.resultCount + 1;
            filters.page = vm.currentPage;
            filters.fylke = vm.chosenFylke;
            filters.textSearch = vm.searchText;
            filters.treatment = vm.chosenCategory !== 'Alle'? vm.chosenCategory : null;

            return filters;
        }

        /**
         * Delete specified hospital from database
         * @param hospital to be deleted
         */
        function deleteHospital(hospital) {
            HospitalsManager.deleteHospital(hospital.id, function (err, data) {
                if (!err) {
                    search();
                }
            });
        }


    }]);