angular.module('<%= $cache.get("instance_config.name") %>').directive('systemMenu', ['Hook',
function(Hook) {
    return {
        restrict : 'E',
        templateUrl : '/view/system_menu.html',
        scope : {
            data : '='
        },
        link : function(scope, element, attributes) {
            scope.adminMenuGroups = [];
        }
    };
}]);
