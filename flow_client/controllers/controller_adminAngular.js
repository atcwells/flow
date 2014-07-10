angular.module('<%= $cache.get("instance_config.name") %>').controller('adminAngular', [
function() {

    var self = this;

    self.refreshAngularApplication = function() {
        Hook('/server/refreshAngularApplication', {}).then(function() {

        });
    };

    self.refreshServer = function() {
        Hook('/server/refreshServer', {}).then(function() {

        });
    };
}]); 