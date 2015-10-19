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
    }).when('/nyheter', {
        controller: 'newsController',
        templateUrl: 'templates/news/list.html',
        controllerAs: 'newsCtrl'
    }).when('/nyheter/:id', {
        controller: 'articleController',
        templateUrl: 'templates/news/view.html',
        controllerAs: 'articleCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);
