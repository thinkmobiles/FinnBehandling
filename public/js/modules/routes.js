app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'indexController',
        templateUrl: 'templates/index.html'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(
    ['$rootScope',
        function ($rootScope) {


        }
    ]
);
