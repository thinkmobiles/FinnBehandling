app.controller('startPageController', ['$scope', 'StaticDataManager', 'GeneralHelpers',
    function ($scope, StaticDataManager, GeneralHelpers) {

        var self = this;
        self.news = [];

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
            });
        }

        getStaticData();
        getNews();
}]);