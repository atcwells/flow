angular.module('<%= $cache.get("instance_config.name") %>').factory('AuthService', ['$http', 'Session', 'APP_CONST', '$location',
function($http, Session, APP_CONST, $location) {
    return {
        login : function(credentials) {
            return $http.post('/auth/login', credentials).then(function(res) {
            	console.log(res);
                Session.create('test', credentials.username, 'admin');
                $location.url('/');
            });
        },
        logout : function() {
            return $http.post('/auth/logout').then(function(res) {
                Session.destroy();
                $location.url('/');
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
