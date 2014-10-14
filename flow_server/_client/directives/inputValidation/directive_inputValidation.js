angular.module("<%= $cache.get('instance_config.name') %>").directive('inputValidation', ['FIELD_VALIDATORS',
function(FIELD_VALIDATORS) {'use strict';

    return {
        require : 'ngModel',
        link : function(scope, el, attrs, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                applyValidity(FIELD_VALIDATORS[attrs.inputValidation], viewValue);
                return viewValue;
            });

            function applyValidity(validator, value) {
                if (validator(value)) {
                    console.log('1');
                    ctrl.$setValidity('invalid-input-' + attrs.inputValidation, true);
                } else {
                    console.log('2');
                    ctrl.$setValidity('invalid-input-' + attrs.inputValidation, false);
                }
            }

        }
    };
}]);
