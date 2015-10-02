app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'startPageController',
        templateUrl: 'templates/startPage.html',
        controllerAs: 'startPageCtrl',
        reloadOnSearch: false
    }).when('/sentere', {
        controller: 'sentereController',
        templateUrl: 'templates/sentere/list.html',
        controllerAs: 'sentereCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);
