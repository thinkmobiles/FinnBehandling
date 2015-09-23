'use strict';

// Init the app configuration module for AngularJS app
var AppConfig = (function() {
    // Init module configuration options
    var appModuleName = 'app';
    var appModuleVendorDependencies = ['ngResource', 'ngRoute', 'ngAnimate', 'mgcrea.ngStrap'];

    // Add a new vertical module
    var registerModule = function(moduleName, dependencies) {
        // Create angular module
        angular.module(moduleName, dependencies || []);

        // Add the module to the AngularJS configuration file
        angular.module(appModuleName).requires.push(moduleName);
    };
    return {
        appModuleName: appModuleName,
        appModuleVendorDependencies: appModuleVendorDependencies,
        registerModule: registerModule
    };
})();