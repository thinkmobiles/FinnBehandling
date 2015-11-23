app.controller('articleController', ['$scope', '$routeParams', '$location', 'NewsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, NewsManager, GeneralHelpers) {
        var self = this;
        var articleId = $routeParams.id;

        $location.hash('main-menu');

        function getArticle() {

            NewsManager.getArticle(articleId, function (err, article) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.article = article;
            });
        }

        getArticle();
    }]);