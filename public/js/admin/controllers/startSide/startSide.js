app.controller('startSideController', ['$scope', 'StartSideManager', 'NewsManager', 'GeneralHelpers',
    function($scope, StartSideManager, NewsManager, GeneralHelpers){
        var self = this;

        (function getStartSide () {

            $scope.pending = true;

            StartSideManager.getStartSide(function(err, startSide) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                $scope.pending = false;

                self.startSide = startSide;
            });
        })();

        function getStaticNews () {

            NewsManager.getNewsList({limit: 3}, function(err, news) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }
                console.log(news);
                self.saticNews = news;
            });
        }

        getStaticNews();

    }]);