angular.module('<%= $cache.get("instance_config.name") %>').factory('Hook', ['$http', 'toaster', '$log', '$q', 'DSCacheFactory',
function($http, toaster, $log, $q, DSCacheFactory) {

    DSCacheFactory('dataCache', {
        maxAge : 90000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval : 600000, // This cache will clear itself every hour.
        //deleteOnExpire : 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode : 'localStorage'
    });
    var dataCache = DSCacheFactory.get('dataCache');

    var fire = function(hook, params, callback) {
        var start = new Date().getTime();
        var deferred = $q.defer();
        var cachedData = dataCache.get(hook + JSON.stringify(params));
        if (cachedData) {
            toaster.pop('success', "Success", "Hook operation " + hook + " (from cache) succeeded.\n Time taken for request: " + (new Date().getTime() - start) + 'ms');
            deferred.resolve(cachedData.data);
        } else {
            $http({
                method : 'POST',
                url : '/api/' + hook,
                data : params,
                timeout : 3000
            }).success(function(response, status, headers, config) {
                if (response.error) {
                    toaster.pop('error', "ERROR", "Hook operation " + hook + " failed.");
                    $log.error("ERROR", response.errorMessage);
                    deferred.reject(response);
                } else {
                    toaster.pop('success', "Success", "Hook operation " + hook + " succeeded.\n Time taken for request: " + (new Date().getTime() - start) + 'ms');
                    dataCache.put(hook + JSON.stringify(params), response);
                    deferred.resolve(response.data);
                }
            }).error(function(response, status, headers, config) {
                toaster.pop('error', "ERROR", "Hook operation " + hook + " failed.");
                $log.error("ERROR", "Hook operation " + hook + " failed.");
                deferred.reject(response);
            });
        }
        return deferred.promise;
    };
    return function(hook, params, callback) {
        return fire(hook, params, callback);
    };
}]);
