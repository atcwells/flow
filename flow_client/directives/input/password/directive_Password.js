'use strict';
angular.module("<%= $cache.get('instance_config.name') %>").directive('inputPassword', ['Hook',
function(Hook) {
    return {
        restrict : 'EAC',
        templateUrl : '/view/largestring.html',
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
