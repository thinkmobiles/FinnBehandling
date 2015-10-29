app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'blank',
        templateUrl: 'templates/admin.html',
        controllerAs: 'blank',
        reloadOnSearch: false
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);