app.factory('HospitalsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getHospitalsList = function (callback) {
        $http({
            url: '/hospitals',
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getHospital = function (id, callback) {
        $http({
            url: '/hospitals/' + id,
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.createHospital = function (data, callback) {
        $http({
            url: '/hospitals',
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

    this.getHospitalsCount = function (params, callback) {
        $http({
            url: '/hospitals/count',
            method: 'GET',
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.updateHospital = function (id, data, callback) {
        $http({
            url: '/hospitals/' + id,
            method: 'PUT',
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, function (response) {
            if (callback)
                callback(response);
        });
    };

    this.deleteHospital = function (id, callback) {
        $http({
            url: '/hospitals/' + id,
            method: 'DELETE'
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