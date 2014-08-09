// create angular app
var app = angular.module('myApp', []);

// create angular directive for matching
app.directive('match', function () {
    return {
        require: 'ngModel',
        restrict: 'A', // restrict to attributes
        scope: {
            match: '='
        },
        link: function(scope, elem, attrs, ctrl) {
            // watch the 'confirmPassword' field for changes
            scope.$watch(function() {
                return (ctrl.$pristine && angular.isUndefined(ctrl.$modelValue)) || scope.match === ctrl.$modelValue;
            },
            // update the validaty of 'confirmPassword' as it changes
            function(currentValue) {
                ctrl.$setValidity('match', currentValue);
            });
        }
    };
});