angular.module('<%= $cache.get("instance_config.name") %>').controller('adminCache', ['Hook', '$location',
function(Hook, $location) {
    var self = this;
    self.cacheObjects = {};

    Hook('cache/read', {
    }).then(function(data) {
    	self.cacheObjects = data.cacheObjects;
    });
}]);
