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
        vm.resultCount = 25;
        vm.resultTotal = 0;
        vm.resultCountVariants = [5, 10, 25, 50, 100, 200];

        vm.hospitals = [];

        vm.search = search;
        vm.deleteHospital = deleteHospital;
        vm.pageChanged = pageChanged;

        search();

        RegionsManager.getFylkes(function (err, data) {
            if (!err) {
                vm.fylkes = data;
            }
        });

        TreatmentsManager.getTreatments(function (err, data) {
            if (!err) {
                vm.categories = data;
            }
        });

        function pageChanged(newPageNumber) {
            vm.currentPage = newPageNumber;
            search();
        }

        /**
         * GET hospitals with applied filters
         */
        function search() {
            var filters = getFilters();

            HospitalsManager.getHospitalsCount(filters, function(err, data){
                if (!err) {
                    vm.resultTotal = parseInt(data.count);
                }
            });

            HospitalsManager.getHospitalsList(filters, function (err, data) {
                if (!err) {
                    vm.hospitals = data;
                    console.log(data)
                }
            });


        }

        /**
         * Prepare and return filter object for GET hospitals query
         * @returns {{}}
         */
        function getFilters() {
            var filters = {};

            filters.limit = vm.resultCount;
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