app.controller('updateArticleController', ['$scope', '$routeParams', '$location', 'NewsManager', 'GeneralHelpers',
    function ($scope, $routeParams, $location, NewsManager, GeneralHelpers) {
        var self = this;
        var articleId = $routeParams.id;

        function getArticle () {

            NewsManager.getArticle(articleId, function(err, article) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.article = article;
            });
        }

        getArticle();

        this.updateArticle = function () {

            NewsManager.updateArticle(articleId, self.article, function(err, article) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                alert('Article successfully updated');

                $location.path('nyheter');
            });
        };
    }]);
