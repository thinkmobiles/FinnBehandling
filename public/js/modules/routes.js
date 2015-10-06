app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'startPageController',
        templateUrl: 'templates/startPage.html',
        controllerAs: 'startPageCtrl',
        reloadOnSearch: false
    }).when('/behandlingstilbud', {
        controller: 'behandlingstilbudController',
        templateUrl: 'templates/behandlingstilbud/list.html',
        controllerAs: 'behandlingstilbudCtrl'
    }).when('/behandlingstilbud/:id', {
        controller: 'hospitalController',
        templateUrl: 'templates/behandlingstilbud/view.html',
        controllerAs: 'hospitalCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);
