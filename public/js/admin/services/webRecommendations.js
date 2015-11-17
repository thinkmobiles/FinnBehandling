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

    this.createWebRecommendation = function (data, callback) {
        $http({
            url: '/webRecommendations',
            method: "POST",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(response);
        });
    };

    this.updateWebRecommendation = function (id, data, callback) {
        $http({
            url: '/webRecommendations/' + id,
            method: "PUT",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(null, response);
        });
    };

    this.removeWebRecommendation = function (id, callback) {
        $http({
            url: '/webRecommendations/' + id,
            method: "DELETE"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(response);
        });
    };

    return this;
}]);