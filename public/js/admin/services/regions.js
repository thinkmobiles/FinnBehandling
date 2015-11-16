/**
 * Created by vasylhoshovsky on 12.11.15.
 */
app.factory('RegionsManager', ['$http', function ($http) {
    "use strict";
    var self = this;

    self.getFylkes = function (callback) {
        $http({
            url: '/regions/fylkes',
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };

    self.getFylkesByPostCode = function (postcode, callback) {
        $http({
            url: '/regions/fylkes?postCode=' + postcode,
            method: 'GET'
        }).then(function (response) {
            if (callback)
                callback(null, response.data);
        }, callback);
    };


    return self;
}]);