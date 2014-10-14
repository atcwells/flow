'use strict';
angular.module("<%= $cache.get('instance_config.name') %>").directive('inputObjectid', ['Hook',
function(Hook) {
    return {
        restrict : 'EAC',
        templateUrl : '/view/objectid.html',
        scope : {
            jsonData : '=',
            fieldName : '@',
            fieldModel : '='
        },
        link : function(scope, element, attributes) {
            Hook('data/read', {
                table : scope.jsonData.ref.toLowerCase(),
                queryFields : {}
            }).then(function(data) {
                scope.references = data.records;
            });
        }
    };
}]);
