app.factory('NewsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.getNewsList = function (params, callback) {
        $http({
            url: '/news',
            method: "GET",
            params: params
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);