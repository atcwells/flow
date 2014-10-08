module.exports = function system(request, response, callback) {
    var self = this;
    self.user = (request && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

	self.properties = {
		responseMechanism: 'sendJSON',
		name: 'system',
		verb: 'post'
	};

    self.refreshServer = function(params) {
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
                self.callback(response);
            });
        });
    };

    self.refreshAngularApplication = function(params) {
        var self = this;
        $server.angular_manager.getAngularRoutes(function() {
            $server.angular_manager.getAngularConstants(function() {
                self.response.message.error = false;
                self.callback(response);
            });
        });
    };

    self.getAdminInfo = function(params) {
        var menu_context = $dbi.schema('menu_context');
        menu_context.find({
            'name' : 'admin'
        }, function(err, menu_contexts) {
            if (err) {
                self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                self.callback(response);
            } else {
                var menu_group = $dbi.schema('menu_group');
                menu_group.find({
                    'menu_context' : menu_contexts[0]._id,
                }, function(err, menu_groups) {
                    var menu_item = $dbi.schema('menu_item');
                    menu_item.find({
                        // 'menu_group' : menu_groups
                    }, function(err, menu_items) {
                        if (err) {
                            self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                            self.callback(response);
                        } else {
                            self.response.message.error = false;
                            self.response.message.data.menu_groups = menu_groups;
                            self.response.message.data.menu_items = menu_items;
                            self.callback(response);
                        }
                    });
                });
            }
        });
    };

    return self;
};
