'use strict';
angular.module("<%= $cache.get('instance_config.name') %>").directive('inputString', ['Hook',
function(Hook) {
    return {
        restrict : 'EAC',
        templateUrl : '/view/string.html',
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
