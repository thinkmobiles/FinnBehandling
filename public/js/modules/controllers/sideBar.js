app.controller('sideBarController', ['$scope', '$location', 'GeneralHelpers',
    function ($scope, $location, GeneralHelpers) {

    $scope.chosenFylke =  GeneralHelpers.getLocalData('fylke') || 'Alle';
    $scope.chosenKategori =  GeneralHelpers.getLocalData('kategori') || 'Alle';
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

    $scope.kategories = [
        'Alle',
        'Kategori 1',
        'Kategori 2',
        'Kategori 3',
        'Kategori 4',
        'Kategori 5',
        'Kategori 6'
    ];

    $scope.search = function () {
        GeneralHelpers.saveAsLocalData('kategori', $scope.chosenKategori);
        GeneralHelpers.saveAsLocalData('fylke', $scope.chosenFylke);
        GeneralHelpers.saveAsLocalData('tekstsok', $scope.tekstsok);
        GeneralHelpers.saveAsLocalData('resultater', $scope.resultater);

        $location.path('sentere');
    };
}]);