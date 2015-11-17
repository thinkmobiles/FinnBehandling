app.factory('NewsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getNewsList = function (params, callback) {
        $http({
            url: '/news',
            method: "GET",
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getArticle = function (id, callback) {
        $http({
            url: '/news/' + id,
            method: "GET"
        }).then(function (response) {

            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getNewsCount = function (callback) {
        $http({
            url: '/news/count',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);