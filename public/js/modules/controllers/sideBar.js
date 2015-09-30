app.controller('sideBarController', ['$scope', '$location', 'GeneralHelpers',
    function ($scope, $location, GeneralHelpers) {

    $scope.chosenFylke =  GeneralHelpers.getLocalData('fylke') || 'Alle';
    $scope.chosenBehandling =  GeneralHelpers.getLocalData('kategori') || 'Alle';
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
        GeneralHelpers.saveAsLocalData('behandling', $scope.chosenBehandling);
        GeneralHelpers.saveAsLocalData('fylke', $scope.chosenFylke);
        GeneralHelpers.saveAsLocalData('tekstsok', $scope.tekstsok);
        GeneralHelpers.saveAsLocalData('resultater', $scope.resultater);

        $location.path('sentere');
    };
}]);