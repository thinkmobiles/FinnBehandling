app.controller('startSideController', ['$scope', 'StartSideManager', 'NewsManager', 'GeneralHelpers',
    function($scope, StartSideManager, NewsManager, GeneralHelpers){
        var self = this;
        self.saticNews = [];

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

            StartSideManager.getStaticNews(function(err, staticNews) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.saticNews = staticNews;
            });
        }

        getStaticNews();

    }]);