app.directive('compareToValidator', function () {

    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, ele, attrs, ctrl) {
            scope.$watch(attrs.compareToValidator, function () {
                ctrl.$validate();
            });
            ctrl.$validators.confirmation = function (modelValue, viewValue) {
                var value = modelValue || viewValue;
                var other = scope.$eval(attrs.compareToValidator);
                return !value || !other || value == other;
            };
        }
    }
});