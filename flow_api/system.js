return function system(response, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.refreshServer = function(params) {
        console.log('test');
        $server.bower_manager = new $dir.bower_manager();
        $server.angular_manager = new $dir.angular_manager();
        $server.client_manager = new $dir.client_manager();
        $server.bower_manager.readBowerJson();
        $server.bower_manager.getDependencyFiles();
        $server.angular_manager.searchForAngularModules();
        $server.client_manager.getClientFiles();
        $server.angular_manager.searchForAngularModules($server.bower_manager.scriptDependencies);
        $server.angular_manager.getAngularRoutes(function() {
            $server.angular_manager.getAngularConstants(function() {
                self.response.message.error = false;
                self.callback();
            });
        });
    };

    self.refreshAngularApplication = function(params) {
        var self = this;
        $server.angular_manager.getAngularRoutes(function() {
            $server.angular_manager.getAngularConstants(function() {
                self.response.message.error = false;
                self.callback();
            });
        });
    };

    self.getAdminInfo = function(params) {
        var menu_context = $dbi('menu_context');
        menu_context.find({
            'name' : 'admin'
        }, function(err, menu_contexts) {
            if (err) {
                self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                self.callback();
            } else {
                var menu_group = $dbi('menu_group');
                menu_group.find({
                    'menu_context' : menu_contexts[0]._id,
                }, function(err, menu_groups) {
                    var menu_item = $dbi('menu_item');
                    menu_item.find({
                        // 'menu_group' : menu_groups
                    }, function(err, menu_items) {
                        if (err) {
                            self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                            self.callback();
                        } else {
                            self.response.message.error = false;
                            self.response.message.data.menu_groups = menu_groups;
                            self.response.message.data.menu_items = menu_items;
                            self.callback();
                        }
                    });
                });
            }
        });
    };

    return self;
};
