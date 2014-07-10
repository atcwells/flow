angular.module('<%= $cache.get("instance_config.name") %>').factory('AuthService', ['$http', 'Session', 'APP_CONST', '$location',
function($http, Session, APP_CONST, $location) {
    return {
        login : function(credentials) {
            return $http.post(APP_CONST.serverUri + '/admin/login/' + credentials.username, credentials).then(function(res) {
                Session.create(res.data.sessionId, res.data.userId, res.data.role);
                $location.url('/admin/home');
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
