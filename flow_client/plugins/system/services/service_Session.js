angular.module('<%= $cache.get("instance_config.name") %>').service('Session', ['$rootScope', 'AUTH_EVENTS', 'USER_ROLES',
function($rootScope, AUTH_EVENTS, USER_ROLES) {
    this.create = function(sessionId, userId, userRole) {
        this.sessionId = sessionId;
        this.userId = userId;
        this.userRole = userRole;
    };
    this.destroy = function() {
        this.sessionId = 'guest';
        this.userId = 'guest';
        this.userRole = USER_ROLES.all;
        $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
    };
    return this;
}]); 