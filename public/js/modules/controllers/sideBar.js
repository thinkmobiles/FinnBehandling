app.controller('sideBarController', ['$scope', '$location', 'UserManager', 'RegionManager', 'TreatmentManager', 'GeneralHelpers',
    function ($scope, $location, UserManager, RegionManager, TreatmentManager, GeneralHelpers) {

        $scope.chosenFylke =  GeneralHelpers.getLocalData('fylke') || 'Alle';
        $scope.chosenBehandling =  +GeneralHelpers.getLocalData('behandling') || null;
        $scope.chosenUnderkategori =  +GeneralHelpers.getLocalData('underkategori') || null;

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

                    } else{
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

        function setUnderkategoriEmpty (){

            $scope.underkategoris = [
                {
                    id: null,
                    name: 'Alle'
                }
            ];
        }
}]);