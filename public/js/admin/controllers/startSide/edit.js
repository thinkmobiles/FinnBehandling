app.controller('updateStartSideController', ['$scope', '$routeParams', '$location', 'StartSideManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, StartSideManager, GeneralHelpers) {
        var self = this;

        function getStartSide () {

            StartSideManager.getStartSide(function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.startSide = startSide;
            });
        }

        getStartSide ();

        this.updateStartSide = function () {

            StartSideManager.updateStartSide(self.startSide, function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('StartSide successfully updated');

                $location.path('startside');
            });
        };
    }]);