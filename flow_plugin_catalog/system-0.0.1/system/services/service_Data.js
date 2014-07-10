angular.module('<%= $cache.get("instance_config.name") %>').factory('Data', ['$http', 'toaster',
function($http, toaster) {
    var fire = function(hook, params, callback) {
        $http({
            method : 'POST',
            url : '/api/hook/' + hook,
            data : params,
            timeout: 3000
        }).success(function(data, status, headers, config) {
            toaster.pop('success', "Success", "Hook operation " + hook + " succeeded.");
            callback(data);
        }).error(function(data, status, headers, config) {
            toaster.pop('error', "ERROR", "Hook operation " + hook + " failed.");
            callback(false);
        });
    };
    return function(hook, params, callback) {
        fire(hook, params, callback);
    };
}]);
