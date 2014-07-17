angular.module('<%= $cache.get("instance_config.name") %>').controller('adminAngular', ['Hook',
function(Hook) {

    var self = this;

    self.refreshAngularApplication = function() {
        Hook('system/refreshAngularApplication', {}).then(function() {
			console.log('test');
        });
    };

    self.refreshServer = function() {
        Hook('system/refreshServer', {}).then(function() {
			console.log('test');
        });
    };
}]); 