app.controller('startPageController', ['$scope', 'NewsManager', 'StaticDataManager', 'GeneralHelpers',
    function ($scope, NewsManager, StaticDataManager, GeneralHelpers) {

        var self = this;

        function getStaticData () {

            StaticDataManager.getStaticData(function(err, staticData) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticData = staticData ? staticData.text : '';
            });
        }

        function getNews () {

            var params = {
                limit: 3
            };

            NewsManager.getNewsList(params, function(err, hospitals) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.news = hospitals;
            });
        }

        getStaticData();
        getNews();
}]);