app.controller('sideBarController', ['$scope', '$location', 'UserManager', 'GeneralHelpers',
    function ($scope, $location, UserManager, GeneralHelpers) {

        $scope.chosenFylke =  GeneralHelpers.getLocalData('fylke') || 'Alle';
        $scope.chosenBehandling =  GeneralHelpers.getLocalData('behandling') || 'Alle';
        $scope.resultater =  GeneralHelpers.getLocalData('resultater') || '25';

        $scope.fylkes = [
            'Alle',
            'Østfold',
            'Akershus',
            'Oslo',
            'Hedmark',
            'Oppland',
            'Buskerud'
        ];

        $scope.behandlings = [
            'Alle',
            'ear',
            'nose',
            'mouth treatment',
            'plastic surgery',
            'bone problems'
        ];

        $scope.search = function () {
            GeneralHelpers.saveAsLocalData('hospitalPage', 1);
            GeneralHelpers.saveAsLocalData('behandling', $scope.chosenBehandling);
            GeneralHelpers.saveAsLocalData('fylke', $scope.chosenFylke);
            GeneralHelpers.saveAsLocalData('tekstsok', $scope.tekstsok);
            GeneralHelpers.saveAsLocalData('resultater', $scope.resultater);

            $scope.$parent.searchResponse = true;

            $location.path('behandlingstilbud');
        };

        $scope.signIn = function () {

            if ($scope.signInForm.$valid) {
                UserManager.signIn($scope.loginParams, function (err) {
                    if (err) {
                        $scope.$parent.isAuthenticated = false;
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    $scope.$parent.isAuthenticated = true;
                });
            }
        };
}]);