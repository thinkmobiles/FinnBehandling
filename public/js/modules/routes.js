app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'startPageController',
        templateUrl: 'templates/startPage.html',
        controllerAs: 'startPageCtrl',
        reloadOnSearch: false
    }).otherwise({
        redirectTo: '/'
    });

}]).run(
    ['$rootScope',
        function ($rootScope) {


        }
    ]
);
