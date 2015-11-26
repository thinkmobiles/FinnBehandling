/**
 * Created by vasylhoshovsky on 25.11.15.
 */
app.controller('editStaticNewController', ['$scope', '$routeParams', '$location', 'StartSideManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, StartSideManager, GeneralHelpers) {
        var self = this;
        self.staticNewId = $routeParams.id;


        function getStaticNew () {

            StartSideManager.getStartSide(function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.startSide = startSide;
            });
        }


        function updateStartSide() {

            StartSideManager.updateStartSide(self.startSide, function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('StartSide successfully updated');

                $location.path('startside');
            });
        };
    }]);