app.factory('AdvertisementsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getAdvertisements = function (params, callback) {
        $http({
            url: '/advertisement',
            method: 'GET',
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.createAdvertisement = function (data, callback) {
        $http({
            url: '/advertisement',
            method: 'POST',
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(response);
        });
    };

    this.getAdvertisementsCount = function (callback) {
        $http({
            url:'/advertisement/count',
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getOneAdvertisement = function (id, callback) {
        $http({
            url: '/advertisement/' + id,
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.updateAdvertisement = function (id, data, callback) {
        $http({
            url:  '/advertisement/' + id,
            method: 'PUT',
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(null, response);
        });
    };

    this.removeAdvertisement = function (id, callback) {
        $http({
            url: '/advertisement/' + id,
            method: 'DELETE'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(null, response);
        });
    };

    return this;
}]);