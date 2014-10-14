angular.module('<%= $cache.get("instance_config.name") %>').controller('adminPlugins', ['Hook',
function(Hook) {
    var self = this;
    self.pluginCatalog = {};
    self.installedPlugins = {};

    Hook('plugin/getPlugins', {}).then(function(data) {
        self.installedPlugins = data.installedPlugins;
        self.pluginCatalog = data.pluginCatalog;
    });

    self.isInstalled = function(name, version) {
        if (self.installedPlugins[name] && self.installedPlugins[name].version === version) {
            return true;
        }
        return false;
    };

    self.installPlugin = function(name, version) {
        Hook('plugin/installPlugin', {
            name : name,
            version : version
        }).then(function(data) {
            self.installedPlugins = data.installedPlugins;
            self.pluginCatalog = data.pluginCatalog;
        });
    };

    self.uninstallPlugin = function(name, version) {
            Hook('plugin/uninstallPlugin', {
            name : name,
            version : version
        }).then(function(data) {
            self.installedPlugins = data.installedPlugins;
            self.pluginCatalog = data.pluginCatalog;
        });
    };
}]); 