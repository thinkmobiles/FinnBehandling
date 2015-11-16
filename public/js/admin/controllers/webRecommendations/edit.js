app.controller('updateWebRecommendationController', ['$scope', '$routeParams', '$location', 'WebRecommendationsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, WebRecommendationsManager, GeneralHelpers) {
        var self = this;
        var recommendationId = $routeParams.id;

        function getRecommendation () {

            WebRecommendationsManager.getWebRecommendation(recommendationId, function (err, recommendation) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.webRecommendation = recommendation;
            });
        }

        getRecommendation();

        this.updateWebRecommendation = function () {

            WebRecommendationsManager.updateWebRecommendation(recommendationId, self.webRecommendation, function (err, recommendation) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('WebRecommendation successfully updated');

                $location.path('webRecommendations');
            });
        };
    }]);