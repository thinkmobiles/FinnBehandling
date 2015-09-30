app.factory('GeneralHelpers', ['$rootScope', '$location', function ($rootScope, $location) {
    "use strict";
    var self = this;

    this.saveAsLocalData = function (key, value) {
        $location.search(key, value).replace();
        $rootScope[key] = value;
    };

    this.getLocalData = function (key) {
        var locationSearch = $location.search();

        if ($rootScope[key]) {

            $location.search(key, $rootScope[key]).replace();
            return $rootScope[key];

        } else if (locationSearch[key]) {

            $rootScope[key] = locationSearch[key];
            return locationSearch[key];
        } else {
            return null;
        }
    };

    return this;
}]);