function _flow_controller() {
    var self = this;
    self._setupTerminationHandlers();
    self.production = self._detectProduction();
    return this;
}

_flow_controller.prototype.startup = function startup(cb) {
    var self = this;
    async.series({
        getManagers : function(callback) {
            $server.bower_manager = new $dir.bower_manager();
            $server.angular_manager = new $dir.angular_manager();
            $server.client_manager = new $dir.client_manager();
            $server.api_manager = new $dir.api_manager();
            callback();
        },
        getBowerDependencies : function(callback) {
            $server.bower_manager.readBowerJson();
            $server.bower_manager.getDependencyFiles();
            callback();
        },
        getInstalledPlugins : function(callback) {
            var numberOfPlugins = 0;
            var pluginNames = _.keys($server.plugin_manager.installedPlugins);
            _.each(pluginNames, function(pluginName) {
                new $dir.plugin(pluginName, function() {
                    if (++numberOfPlugins == pluginNames.length) {
                        callback();
                    }
                });
            });
        },
        getClientDependencies : function(callback) {
            $server.client_manager.getClientFiles();
            callback();
        },
        getAPIFiles : function(callback) {
            $server.api_manager.getAPIFiles();
            callback();
        },
        getAngularApplication : function(callback) {
            $server.angular_manager.searchForAngularModules($server.bower_manager.scriptDependencies);
            $server.angular_manager.getAngularRoutes(function() {
                $server.angular_manager.getAngularConstants(callback);
            });
        }
    }, function() {
        self._log.info('Flow configuration complete');
        cb();
    });
};

_flow_controller.prototype.restart = function restart() {
    var self = this;
    self._log.warn("Refreshing server...");
    self._log.warn("..Flushing Cache...");
    $cache.flush();
    $server.installer.readConfig();
    $cache.set($server.installer.config);
    self._log.warn("..Flushing Schemas...");
    $server.dbi.flushSchemas();
    $server.dbi = new $dir.DatabaseManager();
    self._log.warn("..Shutting down HTTPServer");
    $server.http_server.shutdown();
    self._log.info("Server startup beginning...");
    this.startup();
};

_flow_controller.prototype._setupTerminationHandlers = function setupTerminationHandlers() {
    var self = this;
    self._log.info('Configuring Manual Termination Handlers');
    process.on('exit', function() {
        self._terminator();
    });
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'].forEach(function(element, index, array) {
        process.on(element, function() {
            self._terminator(element);
        });
    });
};
_flow_controller.prototype._terminator = function terminator(sig) {
    if ( typeof sig === "string") {
        this._log.error('Received ' + sig + ' - terminating app ...');
        process.exit(1);
    }
    this._log.error('Node server stopped.');
};

_flow_controller.prototype._detectProduction = function detectProduction() {
    var ip = process.env.OPENSHIFT_NODEJS_IP;
    if (!ip) {
        this._log.warn("Detected development environment");
        return false;
    } else {
        this._log.warn("Detected production environment");
        return true;
    }
};
module.exports = _flow_controller;
