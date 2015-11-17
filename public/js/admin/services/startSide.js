app.factory('StartSideManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getStartSide = function (callback) {
        $http({
            url: '/staticData',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.updateStartSide = function (data, callback) {
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

    return this;
}]);