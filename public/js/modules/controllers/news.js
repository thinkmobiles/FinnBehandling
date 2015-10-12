app.controller('newsController', ['$scope', 'NewsManager', 'GeneralHelpers',
    function ($scope, NewsManager, GeneralHelpers) {
        var self = this;

        $scope.curPage = GeneralHelpers.getLocalData('curPage') || 1;
        $scope.$parent.resultater = GeneralHelpers.getLocalData('resultater') || 25;

        function getNewsCount () {
            NewsManager.getNewsCount(function(err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

        getNewsCount();

        function getNews () {

            $scope.pending = true;

            NewsManager.getNewsList({limit: resultater, page: $scope.curPage}, function(err, news) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;
                $scope.$parent.searchResponse = false;

                self.news = news;
            });
        }

        getNews();
    }]);
