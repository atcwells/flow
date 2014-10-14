angular.module('<%= $cache.get("instance_config.name") %>').service('Session', ['$rootScope', 'AUTH_EVENTS', 'USER_ROLES', 'DSCacheFactory',
function($rootScope, AUTH_EVENTS, USER_ROLES, DSCacheFactory) {

    DSCacheFactory('sessionCache', {
        capacity : 100,
        maxAge : 300000,
        storageMode : 'localStorage',
        //deleteOnExpire : 'aggressive'
    });

    var cache = DSCacheFactory.get('sessionCache');
    if (cache.get('userId')) {
        this.sessionId = cache.get('sessionId');
        this.userId = cache.get('userId');
        this.userRole = cache.get('userRole');
    } else {
        this.userId = 'guest';
    }

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
        cache.removeAll();
    };
    
    return this;
}]);
