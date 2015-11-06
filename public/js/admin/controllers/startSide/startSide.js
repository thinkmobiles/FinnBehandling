app.controller('startSideController', ['$scope', 'StartSideManager', 'GeneralHelpers',
    function($scope, StartSideManager, GeneralHelpers){
        var self = this;

        function getStartSide () {

            $scope.pending = true;

            StartSideManager.getStartSide(function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;

                self.startSide = startSide;
            });
        }

        getStartSide();
    }]);