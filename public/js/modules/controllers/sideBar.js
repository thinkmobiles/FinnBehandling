app.controller('sideBarController', ['$scope', '$location', 'UserManager', 'RegionManager', 'TreatmentManager', 'GeneralHelpers',
    function ($scope, $location, UserManager, RegionManager, TreatmentManager, GeneralHelpers) {

        $scope.chosenFylke = GeneralHelpers.getLocalData('fylke') || 'Alle';
        $scope.chosenBehandling = +GeneralHelpers.getLocalData('behandling') || null;
        $scope.chosenUnderkategori = +GeneralHelpers.getLocalData('underkategori') || null;


        RegionManager.getFylkes(function (err, fylkes) {
            if (err) {
                return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
            }
            if (fylkes && fylkes.length) {
                fylkes.unshift({
                    fylke: 'Alle'
                });
            }

            $scope.fylkes = fylkes;
        });

        TreatmentManager.getTreaments(function (err, treaments) {
            if (err) {
                return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
            }
            if (treaments && treaments.length) {
                treaments.unshift({
                    id: null,
                    name: 'Alle'
                });
            }

            $scope.behandlings = treaments;
        });

        $scope.getUnderkategoris = function () {

            if ($scope.chosenBehandling) {
                TreatmentManager.getSubTreatments($scope.chosenBehandling, function (err, subTreaments) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }
                    if (subTreaments && subTreaments.length) {
                        subTreaments.unshift({
                            id: null,
                            name: 'Alle'
                        });

                        $scope.underkategoris = subTreaments;

                    } else {
                        setUnderkategoriEmpty();
                    }
                });
            } else {

                setUnderkategoriEmpty();
            }
        };

        $scope.getUnderkategoris();

        $scope.search = function () {
            GeneralHelpers.saveAsLocalData('hospitalPage', 1);
            GeneralHelpers.saveAsLocalData('behandling', $scope.chosenBehandling);
            GeneralHelpers.saveAsLocalData('fylke', $scope.chosenFylke);
            GeneralHelpers.saveAsLocalData('underkategori', $scope.chosenUnderkategori);
            GeneralHelpers.saveAsLocalData('tekstsok', $scope.tekstsok);


            $scope.$parent.searchResponse = true;

            $location.path('behandlingstilbud');
        };

        $scope.signIn = function () {

            if ($scope.signInForm.$valid) {
                UserManager.signIn($scope.loginParams, function (err) {
                    if (err) {
                        $scope.$parent.isAuthenticated = false;
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    $scope.$parent.isAuthenticated = true;
                });
            }
        };

        function setUnderkategoriEmpty() {

            $scope.underkategoris = [
                {
                    id: null,
                    name: 'Alle'
                }
            ];
        }

        /**
         *  Share with facebook function
         */
        $scope.shareFB = function () {
            var data = getShareableInfo();
            FB.ui({
                method: 'share',
                name: data.name,
                href: data.link,
                description: data.description,
                picture: data.pictureUrl
            }, function (response) {
                console.log(response);
            });
        };

        /**
         *  Share with twitter function
         */
        $scope.shareTwitter = function () {
            var data = getShareableInfo();

            var url = encodeURI(data.link);
            var text = encodeURI(data.description);

            return "http://twitter.com/intent/tweet?url=" + url + "&text=" + text;
        };

        /**
         *  Share with google+ function
         */
        $scope.shareGoogle = function(){
            var data = getShareableInfo();
            return data;
        };

        /**
         *  Share with blogger function
         */
        $scope.shareBlogger = function(){
            var data = getShareableInfo();

            var url = encodeURI(data.link);
            var name = encodeURI(data.name);
            var imageCode = '<img src="http://placehold.it/350x350" style="float: left; margin-right: 20px;"/>';
            var text = encodeURI(imageCode + data.description);

            return 'https://www.blogger.com/blog-this.g?u=' + url + '&n=' + name + '&t=' + text;
        };

        /**
         *  Share with yahoo function
         */
        $scope.shareYahoo = function(){
            var data = getShareableInfo();

            var url = encodeURI(data.link);
            var name = encodeURI(data.name);
            var text = encodeURI(data.description);

            return 'http://compose.mail.yahoo.com/?subject=' + name + '&body='   + text + ' \n' + url;
        };


        /**
         * Encode URI wrapper
         * @param text
         * @returns {string}
         */
        $scope.urlEncoder = function (text) {
            return encodeURI(text);
        };


         //ymsgr:im?+&msg=<?=$currentPageURL;?>
        /**
         * You can specify share information here
         * @returns {{name: string, link: string, description: string, pictureUrl: string}}
         */
        function getShareableInfo() {
            var data = {
                name: 'FinnBehandling',
                link: 'http://FinnBehandling.com',
                description: 'FinnBehandling - best site ever... Some other description for test purpose',
                pictureUrl: 'http://placehold.it/350x350'
            };
            return data;
        }


    }]);