app.controller('startPageController', ['$scope', '$sce', 'StaticDataManager', 'GeneralHelpers',
    function ($scope, $sce, StaticDataManager, GeneralHelpers) {
        var self = this;

        self.news = [];
        self.toggleLimit = toggleLimit;
        self.advertisement = null;

        function toggleLimit (article) {
            if (article.limit === 800) {
                article.limit = article.content.length;
                article.showAll = true;
            } else {
                article.limit = 800;
                article.showAll = false;
            }
        }

        function getStaticData () {

            StaticDataManager.getStaticData(function(err, staticData) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticData = staticData ? staticData.text : '';
            });
        }

        function getNews () {

            StaticDataManager.getStaticNews(function(err, staticNews) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.news = staticNews;

                for (var i = self.news.length-1; i >= 0; i--) {
                    self.news[i].limit = 800;
                    self.news[i].showAll = false;
                }
            });
        }


        getStaticData();
        getNews();
    }]);