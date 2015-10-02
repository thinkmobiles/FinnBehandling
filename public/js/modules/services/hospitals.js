app.factory('HospitalManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getHospitalsList = function (callback) {
        $http({
            url: '/hospitals',
            method: "GET"
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

    return this;
}]);