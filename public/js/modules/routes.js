app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'startPageController',
        templateUrl: 'templates/startPage.html',
        controllerAs: 'startPageCtrl',
        reloadOnSearch: false
    }).when('/signUp', {
        controller: 'signUpController',
        templateUrl: 'templates/signUp.html',
        controllerAs: 'signUpCtrl',
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

}]).run(['$rootScope', 'UserManager', function ($rootScope, UserManager) {

    UserManager.isAuthorized(function (err) {
        $rootScope.logedIn = !err;
    });

}]);
