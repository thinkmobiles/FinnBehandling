app.controller('startSideController', ['$scope', 'StartSideManager', 'NewsManager', 'GeneralHelpers',
    function($scope, StartSideManager, NewsManager, GeneralHelpers){
        var self = this;
        self.staticNews = [];
        self.staticNewsArchive = {};


        self.showArchiveToggle = showArchiveToggle;
        self.isArchiveShown = isArchiveShown;

        /**
         * In case of staticNewsArchive is empty get data from db and show list of static news for specified branch
         * Clear that archive and hide otherwise
         *
         * @param position
         */
        function showArchiveToggle(position, staticNewId) {
            if (!self.staticNewsArchive[position]) {
                getStaticNewsArchive(position, staticNewId);
            } else {
                self.staticNewsArchive[position] = null;
            }

        }

        /**
         * Check if static news archive is not empty for specified branch
         *
         * @param position
         * @returns {*}
         */
        function isArchiveShown(position) {
            return self.staticNewsArchive[position];
        }

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

        /**
         * GET an array of three static news (which are not archived)
         * In case of success store response into self.staticNews
         */
        function getStaticNews () {


            StartSideManager.getStaticNews(function(err, staticNews) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticNews = staticNews;
            });
        }

        /**
         * GET an array of all static news for specified branch
         * In case of success store response into self.staticNewsArchive
         *
         * @param position
         */
        function getStaticNewsArchive (position, staticNewId) {
            console.log(position, staticNewId)

            StartSideManager.getStaticNewsArchive(position, staticNewId, function(err, staticNewsArchive) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticNewsArchive[position] = staticNewsArchive;
            });
        }

        getStaticNews();

    }]);