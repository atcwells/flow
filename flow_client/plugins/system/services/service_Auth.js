angular.module('<%= $cache.get("instance_config.name") %>').factory('AuthService', ['$http', 'Session', 'APP_CONST', '$location', '$route',
function($http, Session, APP_CONST, $location, $route) {
	
	var route = $route;
    return {
        login : function(credentials) {
            return $http.post('/auth/login', credentials).then(function(res) {
                Session.create('test', credentials.username, 'admin');
                $location.url('/');
                location.replace('/');
            });
        },
        logout : function() {
            return $http.post('/auth/logout').then(function(res) {
                Session.destroy();
                $location.url('/');
                location.replace('/');
            });
        },
        isAuthenticated : function() {
            return !!Session.userId;
        },
        isAuthorized : function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
        }
    };
}]);
