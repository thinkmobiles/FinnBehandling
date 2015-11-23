app.factory('WebRecommendationsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getRecommendationsList = function (params, callback) {
        $http({
            url: '/webRecommendations',
            method: "GET",
            params: params
        }).then(function (response) {

            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getWebRecommendation = function (id, callback) {
        $http({
            url: '/webRecommendations/' + id,
            method: "GET"
        }).then(function (response) {

            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getWebRecommendationsCount = function (callback) {
        $http({
            url: '/webRecommendations/count',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);