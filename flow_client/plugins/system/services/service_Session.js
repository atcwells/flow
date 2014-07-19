angular.module('<%= $cache.get("instance_config.name") %>').service('Session', ['$rootScope', 'AUTH_EVENTS', 'USER_ROLES', 'DSCacheFactory',
function($rootScope, AUTH_EVENTS, USER_ROLES, DSCacheFactory) {

    var cache = DSCacheFactory('session', {
        capacity : 100,
        maxAge : 300000,
        storageMode : 'localStorage',
        //deleteOnExpire : 'aggressive'
    });

    this.userId = 'guest';

    this.create = function(sessionId, userId, userRole) {
        cache.put('sessionId', sessionId);
        cache.put('userId', userId);
        cache.put('userRole', userRole);
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
    console.log(cache.get('sessionId'));
    return this;
}]);
