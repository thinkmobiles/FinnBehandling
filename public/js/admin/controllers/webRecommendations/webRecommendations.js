app.controller('webRecommendationsController', ['$scope', 'WebRecommendationsManager', 'GeneralHelpers',
    function ($scope, WebRecommendationsManager, GeneralHelpers) {
        var self = this;

        $scope.webRecommendationsPage = GeneralHelpers.getLocalData("webRecommendations") || 1;
        $scope.resultater = 10;

        function getWebRecommendationsCount () {

            WebRecommendationsManager.getWebRecommendationsCount(function (err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

        getWebRecommendationsCount();

        this.refreshWebRecommendations = function () {
            GeneralHelpers.saveAsLocalData('webRecommendations', $scope.webRecommendationsPage);

            getWebRecommendations();
        };

        function getWebRecommendations () {

            $scope.pending = true;

            WebRecommendationsManager.getRecommendationsList({limit: $scope.resultater, page: $scope.webRecommendationsPage},
                function (err, webRecommendations) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }
                    $scope.pending = false;

                    $scope.webRecommendations = webRecommendations;
                });
        }

        getWebRecommendations();

        this.deleteWebRecommendation = function (remommendationId) {

            WebRecommendationsManager.removeWebRecommendation(remommendationId, function (err) {
                if (err){
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Deleted successfully');

                getWebRecommendations();
                getWebRecommendationsCount();
            });
        };

    }]);