app.controller('conflictsController', ['$scope', 'ConflictsManager', 'GeneralHelpers', 'HospitalsManager',
    function ($scope, ConflictsManager, GeneralHelpers, HospitalsManager) {
        var self = this;

        self.hospitals = [];

        HospitalsManager.getHospitalsList('', function(err, data){
            if (!err) {
                self.hospitals = data;
            }
        });


        function getConflicts() {

            ConflictsManager.getConflictsList(function (err, conflicts) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.conflicts = conflicts;
            });
        }

        getConflicts();

        this.updateZipCodes = function () {

            ConflictsManager.updateDb(function (err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert("Zip codes updated successful");
            });
        };

    }]);