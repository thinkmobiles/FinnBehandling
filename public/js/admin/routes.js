app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'blank',
        templateUrl: 'templates/admin.html',
        controllerAs: 'blank',
        reloadOnSearch: false
    }).when('/nyheter', {
        controller: 'newsController',
        templateUrl: 'templates/news/admin/list.html',
        controllerAs: 'newsCtrl'
    }).when('/nyheter/:id', {
        controller: 'updateArticleController',
        templateUrl: 'templates/news/admin/edit.html',
        controllerAs: 'updateArticleCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);