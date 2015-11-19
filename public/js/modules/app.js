'use strict';

var app = angular.module(AppConfig.appModuleName, AppConfig.appModuleVendorDependencies).filter('trust', [
    '$sce',
    function($sce) {
        return function(value, type) {
            // Defaults to treating trusted text as `html`
            return $sce.trustAs(type || 'html', value);
        }
    }
]);
//Then define the init function for starting up the app
angular.element(document).ready(function() {
    //Then init the app
    angular.bootstrap(document, [AppConfig.appModuleName]);
});
