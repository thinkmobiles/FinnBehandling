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
                self.oldImage = article.image;
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

        this.removeImage = function (name) {
            self.article[name] = null;
            self[name] = null;
            $('#' + name).val(null);
            $( '#' + name + '-slider').slider('disable');
        };

        this.cropResult = function (croppedImageBase64, type) {
            self.article[type] = croppedImageBase64;
        };

        this.checkImageType = function (name) {
            var imageContent = self[name];

            /*if (!imageContent) {
                return;
            }

            Client.checkFileType(imageContent, function (err, response) {
                if (err) {
                    self.removeImage(name);
                    return ErrMsg.show({message: err.data.error, status: err.status});
                }

                if (!response.validImage) {
                    self.removeImage(name);
                    return alert ('File is not image');
                }
            });*/
        };
    }]);
