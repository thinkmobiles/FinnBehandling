app.controller('startSideController', ['$scope', 'StartSideManager', 'NewsManager', 'GeneralHelpers',
    function ($scope, StartSideManager, NewsManager, GeneralHelpers) {
        var self = this;
        self.staticNews = [];
        self.staticNewsArchive = {};


        self.showArchiveToggle = showArchiveToggle;
        self.isArchiveShown = isArchiveShown;
        self.deleteStaticNew = deleteStaticNew;
        self.toggleLimit = toggleLimit;



        function toggleLimit (staticNew, limit) {
            console.log(staticNew)
            if (staticNew.limit === limit) {
                staticNew.limit = staticNew.content.length;
                staticNew.showAll = true;
            } else {
                staticNew.limit = limit;
                staticNew.showAll = false;
            }
        }

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

        /**
         * Delete static new with specified id from db
         *
         * @param staticNewId
         */
        function deleteStaticNew(staticNewId) {
            if (confirm('Are you sure?')) {
                StartSideManager.deleteStaticNew(staticNewId, function (err, response) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }
                });
            }
        }

        (function getStartSide() {

            $scope.pending = true;

            StartSideManager.getStartSide(function (err, startSide) {
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
        function getStaticNews() {


            StartSideManager.getStaticNews(function (err, staticNews) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticNews = staticNews;

                for (var i = self.staticNews.length-1; i >= 0; i--) {
                    self.staticNews[i].limit = 800;
                    self.staticNews[i].showAll = false;
                }
            });
        }

        /**
         * GET an array of all static news for specified branch
         * In case of success store response into self.staticNewsArchive
         *
         * @param position
         */
        function getStaticNewsArchive(position, staticNewId) {

            StartSideManager.getStaticNewsArchive(position, staticNewId, function (err, staticNewsArchive) {
                if (err) {
                    return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                }

                self.staticNewsArchive[position] = staticNewsArchive;

                for (var i = self.staticNewsArchive[position].length-1; i >= 0; i--) {
                    self.staticNewsArchive[position][i].limit = 400;
                    self.staticNewsArchive[position][i].showAll = false;
                }
            });
        }

        getStaticNews();

    }]);