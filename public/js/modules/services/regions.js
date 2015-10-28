app.factory('RegionManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getFylkes = function (callback) {
        $http({
            url: '/regions/fylkes',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);