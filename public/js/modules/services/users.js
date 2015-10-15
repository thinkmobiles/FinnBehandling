app.factory('UserManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    this.signIn = function (data, callback) {
        $http({
            url: '/user/signIn',
            method: "POST",
            data: data
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);