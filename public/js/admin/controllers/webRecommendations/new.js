app.controller('newWebRecommendationController', ['$scope', '$routeParams', '$location', 'WebRecommendationsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, WebRecommendationsManager, GeneralHelpers) {
        var self = this;

        this.createWebRecommendation = function () {

            WebRecommendationsManager.createWebRecommendation(self.webRecommendation, function (err, response) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Article successfully created');

                $location.path('webrecommendations');
            });
        };

    }]);