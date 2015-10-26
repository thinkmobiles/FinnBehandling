app.controller('contactController', ['$scope', 'UserManager', 'GeneralHelpers',
    function ($scope, UserManager, GeneralHelpers) {

        var self = this;

        this.sendEmail = function () {

            if ($scope.sendEmailForm.$valid) {

                UserManager.sendEmail(self.email, function(err, response) {
                    if (err) {
                        return GeneralHelpers.showErrorMessage({message: err.data.error, status: err.status});
                    } else {
                        alert('success');
                        $scope.sendEmailForm.$submitted = false;
                        self.email = {};
                    }
                });
            }
        };
    }]);