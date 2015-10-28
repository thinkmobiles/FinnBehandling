app.factory('TreatmentManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getTreaments = function (callback) {
        $http({
            url: '/treatment',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.getSubTreatments = function (id, callback) {
        $http({
            url: '/treatment/' + id,
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);