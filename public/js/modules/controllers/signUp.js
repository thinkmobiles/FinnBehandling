app.controller('signUpController', ['$scope', 'UserManager', 'GeneralHelpers', 'PATTERNS',
    function ($scope, UserManager, GeneralHelpers, PATTERNS) {

        var self = this;

        $scope.emailPattern = PATTERNS.EMAIL;

        this.signUp = function () {

            if ($scope.signUpForm.$valid && $scope.acceptRules) {
                UserManager.signIn(self.registerParams, function (err) {
                    if (err) {
                        $scope.$parent.isAuthenticated = false;
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    }

                    $scope.$parent.isAuthenticated = true;
                });
            }
        };
    }]);