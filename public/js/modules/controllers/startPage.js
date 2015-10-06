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

            hospitals[0].image = 'http://www.saturdayeveningpost.com/wp-content/uploads/satevepost/photo_2009-12_26_biomedical_research-400x300.jpg';
            hospitals[1].image = 'http://cdn1.medicalnewstoday.com/content/images/articles/284/284381/pills.jpg';
            hospitals[2].image = 'http://a.abcnews.com/images/Health/GTY_cat_scan_jef_141203_16x9_992.jpg';

            self.news = hospitals;
        });
    }

    getNews();
}]);