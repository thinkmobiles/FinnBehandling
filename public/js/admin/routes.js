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
    }).when('/startside', {
        controller: 'startSideController',
        templateUrl: 'templates/startSide/admin/startSide.html',
        controllerAs: 'startSideCtrl'
    }).when('/startside/edit', {
        controller: 'updateStartSideController',
        templateUrl: 'templates/startSide/admin/edit.html',
        controllerAs: 'updateStartSideCtrl'
    }).when('/hospital/new', {
        controller: 'editHospitalController',
        templateUrl: 'templates/hospital/edit-form.html',
        controllerAs: 'editHospitalCtrl'
    }).when('/hospital/:id', {
        controller: 'editHospitalController',
        templateUrl: 'templates/hospital/edit-form.html',
        controllerAs: 'editHospitalCtrl'
    }).when('/hospitals', {
        controller: 'listHospitalController',
        templateUrl: 'templates/hospital/hospital-list.html',
        controllerAs: 'listHospitalCtrl'
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