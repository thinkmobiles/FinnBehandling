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
        templateUrl: 'templates/index.html',
        controllerAs: 'blank',
        reloadOnSearch: false
    }).when('/admin', {
        controller: 'conflictsController',
        templateUrl: 'templates/admin.html',
        controllerAs: 'conflictsCtrl'
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
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);