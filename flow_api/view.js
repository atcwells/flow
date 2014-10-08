module.exports = function view(request, response, callback) {
    var self = this;
    self.user = (request && request.user && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

	self.properties = {
		responseMechanism: 'sendJSON',
		name: 'view',
		verb: 'post'
	};

    self.getView = function(params) {
        var view = $server.asset_manager.get(params.view);
        if (view) {
            self.response.message.error = false;
            self.response.message.data.view = view;
            self.response.message.data.controller = $server.asset_manager.getControllerForView(view);
            self.callback(response);
        } else {
            self.response.message.error = true;
            self.response.message.errorMessage = "ERROR: Unable to find view: " + params;
            self.callback(response);
        }
    };

    self.getViewNames = function(params) {
        self.response.message.error = false;
        self.response.message.data.viewNames = self._getViewNames();
        self.callback(response);
    };

    self.save = function(params) {
        try {
            var view = $server.asset_manager.get(params.view.filePath);
            view.contents = params.view.contents;
            view.writeFile();
            var controller = $server.asset_manager.get(params.controller.filePath);
            controller.contents = params.controller.contents;
            controller.writeFile();
            self.response.message.error = false;
            self.callback(response);
        } catch (error) {
            self.response.message.error = true;
            self.response.message.errorMessage = "ERROR: Unable to save view: " + params;
            self.callback(response);
        }
    };

    self.deleteView = function(params) {
        try {
            var view = $server.asset_manager.get(params.view.filePath);
            view.deleteFile();
            $server.asset_manager.removeAsset(params.view.filePath);
            var controller = $server.asset_manager.get(params.controller.filePath);
            controller.deleteFile();
            $server.asset_manager.removeAsset(params.controller.filePath);
            self.response.message.data.viewNames = self._getViewNames();
            self.response.message.error = false;
            self.callback(response);
        } catch (error) {
            self.response.message.error = true;
            self.response.message.errorMessage = "ERROR: Unable to save view: " + params;
            self.callback(response);
        }
    };

    self.createView = function(params) {
        try {
            var file = new $dir.file('./flow_client/views/' + params.name + '.html');
            file.contents = '<div id="' + params.name + '">\n</div>';
            file.writeFile();
            var controller = new $dir.file('./flow_client/controllers/controller_' + params.name + '.js');
            controller.contents = "angular.module('<%= $cache.get(\"instance_config.name\") %>').controller('" + params.name + "', [\nfunction() {\n}]);";
            controller.writeFile();
            var Route = $dbi.schema('angular_route');
            var newRoute = Route({
                templateUrl : params.route_template,
                controller : params.route_controller,
                name : params.route_url
            });
            newRoute.save(function(err, result) {
                if (err) {
                    self.response.message.error = true;
                    self.response.message.errorMessage = "ERROR: Unable to save route: " + err;
                    self.callback(response);
                } else {
                    self.response.message.error = false;
                    self.response.message.data.view = file;
                    self.response.message.data.controller = controller;
                    self.callback(response);
                }
            });
        } catch (error) {
            self.response.message.error = true;
            self.response.message.errorMessage = "ERROR: Unable to save view: " + params;
            self.callback(response);
        }
    };

    self._getViewNames = function() {
        var views = $server.asset_manager.getAssetGroup('view');
        var viewList = [];
        for (var key in views) {
            if (key.indexOf('index.html') == -1) {
                viewList.push({
                    path : views[key].filePath,
                    name : views[key].fileName
                });
            }
        }
        return viewList;
    };

    return self;
};
