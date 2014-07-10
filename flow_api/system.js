return function system(response, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.refreshServer = function(params) {
        $server.bower_manager.readBowerJson();
        $server.bower_manager.getDependencyFiles();
        $server.angular_manager.searchForAngularModules();
        $server.client_manager.getClientFiles();
        $server.angular_manager.searchForAngularModules($server.bower_manager.scriptDependencies);

        self.response.message.error = false;
        self.callback();
    };

    self.refreshAngularApplication = function(params) {
        $server.angular_manager.getAngularRoutes(function() {
            $server.angular_manager.getAngularConstants(function() {
                self.response.message.error = false;
                self.callback();
            });
        });
    };

    self.getAdminInfo = function(params) {
        var table = $dbi('link');
        table.find({
            'menu_context' : 'admin'
        }, function(err, results) {
            if (err) {
                self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.records = results;
                self.response.message.data.structure = $cache.get('schema.' + params.table);
                self.response.message.data.installedPlugins = $server.plugin_manager.installedPlugins;
                self.callback();
            }
        });
    };

    return self;
};
