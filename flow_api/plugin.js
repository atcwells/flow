return function plugin(response, user, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.getPlugins = function(params) {
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback();
    };
    
    self.installPlugin = function(params) {
    	$server.plugin_manager.installPlugin(params.name, params.version);
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback();
    };
    
    self.uninstallPlugin = function(params) {
    	$server.plugin_manager.uninstallPlugin(params.name, params.version);
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback();
    };

    return self;
};
