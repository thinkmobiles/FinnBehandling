app.config(['$routeProvider', '$provide', function ($routeProvider, $provide) {


    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) {

        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
            ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent']
        ];

        return taOptions;
    }]);


    $routeProvider.when('/', {
        controller: 'blank',
        templateUrl: 'templates/admin.html',
        controllerAs: 'blank',
        reloadOnSearch: false
    }).when('/nyheter', {
        controller: 'newsController',
        templateUrl: 'templates/news/admin/list.html',
        controllerAs: 'newsCtrl'
    }).when('/nyheter/new', {
        controller: 'newArticleController',
        templateUrl: 'templates/news/admin/new.html',
        controllerAs: 'newArticleCtrl'
    }).when('/nyheter/:id', {
        controller: 'updateArticleController',
        templateUrl: 'templates/news/admin/edit.html',
        controllerAs: 'updateArticleCtrl'
    }).when('/anonser', {
        controller: 'advertisementsController',
        templateUrl: 'templates/advertisements/admin/list.html',
        controllerAs: 'advertisementsCtrl'
    }).when('/anonser/new', {
        controller: 'newAdvertisementController',
        templateUrl: 'templates/advertisements/admin/new.html',
        controllerAs: 'newAdvertisementCtrl'
    }).when('/anonser/:id', {
        controller: 'updateAdvertisementController',
        templateUrl: 'templates/advertisements/admin/edit.html',
        controllerAs: 'updateAdvertisementCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {

}]);