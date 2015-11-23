app.factory('ConflictsManager', ['$http', function ($http) {

    this.getConflictsList = function (callback) {
        $http({
            url: '/hospitals/conflicts',
            method: "GET"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    this.updateDb = function (callback) {
        $http({
            url: '/regions/updateDB',
            method: "POST"
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    return this;
}]);