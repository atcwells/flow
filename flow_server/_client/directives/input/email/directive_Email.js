'use strict';
angular.module("<%= $cache.get('instance_config.name') %>").directive('inputEmail', ['Hook', 'FIELD_VALIDATORS',
function(Hook, FIELD_VALIDATORS) {
    return {
        restrict : 'EAC',
        templateUrl : '/view/email.html',
        scope : {
            jsonData : '=',
            fieldName : '=',
            fieldModel : '='
        },
        link : function(scope, element, attributes) {
            scope.fieldName = attributes.fieldName;
        }
    };
}]);
