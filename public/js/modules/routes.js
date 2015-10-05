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
    }).when('/sentere/:id', {
        controller: 'hospitalController',
        templateUrl: 'templates/sentere/view.html',
        controllerAs: 'hospitalCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);
