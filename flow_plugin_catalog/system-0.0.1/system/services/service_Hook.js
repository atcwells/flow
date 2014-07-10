angular.module('<%= $cache.get("instance_config.name") %>').factory('Hook', ['$http', 'toaster', '$log', '$q',
function($http, toaster, $log, $q) {
    var fire = function(hook, params, callback) {
        var start = new Date().getTime();
        var deferred = $q.defer();
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
                deferred.resolve(response.data);
            }
        }).error(function(response, status, headers, config) {
            toaster.pop('error', "ERROR", "Hook operation " + hook + " failed.");
            $log.error("ERROR", "Hook operation " + hook + " failed.");
            deferred.reject(response);
        });
        return deferred.promise;
    };
    return function(hook, params, callback) {
        return fire(hook, params, callback);
    };
}]);