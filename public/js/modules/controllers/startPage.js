app.controller('startPageController', ['$scope', 'NewsManager', 'GeneralHelpers',
    function ($scope, NewsManager, GeneralHelpers) {

    var self = this;

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

    getNews();
}]);