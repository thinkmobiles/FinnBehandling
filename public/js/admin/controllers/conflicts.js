app.controller('conflictsController', ['$scope', 'ConflictsManager', 'GeneralHelpers',
    function ($scope, ConflictsManager, GeneralHelpers) {
        var self = this;

        function getConflicts () {

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