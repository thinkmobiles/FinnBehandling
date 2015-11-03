app.controller('newsController', ['$scope', 'NewsManager', 'GeneralHelpers',
    function ($scope, NewsManager, GeneralHelpers) {
        var self = this;

        $scope.newsPage = GeneralHelpers.getLocalData('newsPage') || 1;
        $scope.resultater = 10;

        function getNewsCount () {
            NewsManager.getNewsCount(function(err, result) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.totalItems = result.count;
            });
        }

        getNewsCount();

        this.refreshNews = function () {
            GeneralHelpers.saveAsLocalData('newsPage', $scope.newsPage);

            getNews();
        };

        function getNews () {

            $scope.pending = true;

            NewsManager.getNewsList({limit: $scope.resultater, page: $scope.newsPage}, function(err, news) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;

                self.news = news;
            });
        }

        getNews();

        this.deleteArticle = function (articleId) {

            NewsManager.removeArticle(articleId, function(err) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Deleted successfully');

                getNews();

                getNewsCount();
            });
        };
    }]);
