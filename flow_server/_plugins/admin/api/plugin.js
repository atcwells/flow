module.exports = function plugin(request, response, callback) {
    var self = this;
    self.user = (request && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

	self.properties = {
		responseMechanism: 'sendJSON',
		name: 'plugin',
		verb: 'post'
	};

    self.getPlugins = function(params) {
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback(response);
    };
    
    self.installPlugin = function(params) {
    	$server.plugin_manager.installPlugin(params.name, params.version);
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback(response);
    };
    
    self.uninstallPlugin = function(params) {
    	$server.plugin_manager.uninstallPlugin(params.name, params.version);
		self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
		self.response.message.data.pluginCatalog = $server.plugin_manager.pluginCatalog;
        self.response.message.error = false;
        self.callback(response);
    };

    return self;
};
