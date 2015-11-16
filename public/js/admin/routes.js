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
    }).when('/startside', {
        controller: 'startSideController',
        templateUrl: 'templates/startSide/admin/startSide.html',
        controllerAs: 'startSideCtrl'
    }).when('/startside/edit', {
        controller: 'updateStartSideController',
        templateUrl: 'templates/startSide/admin/edit.html',
        controllerAs: 'updateStartSideCtrl'
    }).when('/webRecommendations', {
        controller: 'webRecommendationsController',
        templateUrl: 'templates/webRecommendations/admin/list.html',
        controllerAs: 'webRecommendationsCtrl'
    }).when('/webRecommendations/new', {
        controller: 'newWebRecommendationController',
        templateUrl: 'templates/webRecommendations/admin/new.html',
        controllerAs: 'newWebRecommendationCtrl'
    }).when('/webRecommendations/:id', {
        controller: 'updateWebRecommendationController',
        templateUrl: 'templates/webRecommendations/admin/edit.html',
        controllerAs: 'updateWebRecommendationCtrl'
    }).otherwise({
        redirectTo: '/'
    });

}]).run(['$rootScope', function ($rootScope) {


}]);