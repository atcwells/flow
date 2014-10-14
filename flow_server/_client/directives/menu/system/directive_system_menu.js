angular.module('<%= $cache.get("instance_config.name") %>').directive('systemMenu', ['Hook', '$location', 'AuthService', 'Session',
function(Hook, $location, AuthService, Session) {
    return {
        restrict : 'E',
        templateUrl : '/view/system_menu.html',
        scope : {
            data : '='
        },
        link : function(scope, element, attributes) {
            scope.adminMenuGroups = [];
            scope.Session = Session;

            scope.redirectLogin = function() {
                $location.url('/login');
            };
            
            scope.logout = function() {
               AuthService.logout();
            };
        }
    };
}]);
