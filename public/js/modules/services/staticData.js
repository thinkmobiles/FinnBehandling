app.factory('StaticDataManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getStaticData = function (callback) {
        $http({
            url: '/staticData',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getStaticNews = function (callback) {
        $http({
            url: '/staticNews',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);