app.factory('HospitalManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getHospitalsList = function (params, callback) {
        $http({
            url: '/hospitals',
            method: "GET",
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getHospital = function (id, callback) {
        $http({
            url: '/hospitals/' + id,
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getHospitalsCount = function (params, callback) {
        $http({
            url: '/hospitals/count',
            method: "GET",
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);