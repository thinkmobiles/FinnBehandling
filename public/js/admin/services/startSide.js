app.factory('StartSideManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    self.getStartSide = function (callback) {
        $http({
            url: '/staticData',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.updateStartSide = function (data, callback) {
        $http({
            url: '/staticData',
            method: "PUT",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(response);
        });
    };

    self.getStaticNews = function (callback) {
        $http({
            url: '/staticNews',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.getStaticNewsArchive = function (branch, staticNewId, callback) {
        $http({
            url: '/staticNews/branch/' + branch,
            method: "GET",
            params: {staticNewId: staticNewId}
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.getStaticNew = function (id, callback) {
        $http({
            url: '/staticNews/' + id,
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.editStaticNews = function (id, data, callback) {
        $http({
            url: '/staticNews/' + id,
            method: "PUT",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.createStaticNews = function (data, callback) {
        $http({
            url: '/staticNews',
            method: "POST",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.deleteStaticNews = function (id, callback) {
        $http({
            url: '/staticNews/' + id,
            method: "DELETE"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };


    return self;
}]);