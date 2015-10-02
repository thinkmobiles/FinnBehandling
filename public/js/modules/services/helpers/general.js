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

    this.showErrorMessage = function (err) {
        switch (err.status) {
            case 400:
                if (err.message) {
                    $rootScope.errMsg = err.message;
                } else {
                    $rootScope.errMsg = 'Bad Request. The request was invalid or cannot be otherwise served.';
                }
                alert($rootScope.errMsg);
                break;
            case 404:
                $rootScope.errMsg = 'Page not found ';
                alert($rootScope.errMsg);
                break;
            case 500:
                $rootScope.errMsg = 'Something is broken. Please contact to site administrator.';
                alert($rootScope.errMsg);
                break;
            case 401:
                window.location = '/';
                break;
            case 403:
                window.location = '/';
                break;
            case 413:
                $rootScope.errMsg = 'File is too big.';
                alert($rootScope.errMsg);
                break;
            default:
                console.log(err);
        }
    };

    return this;
}]);