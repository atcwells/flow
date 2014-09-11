function _flow_controller() {
    var self = this;

    _.include({
        bower_manager : 'manager/bower_manager',
        angular_manager : 'manager/angular_manager',
        client_manager : 'manager/client_manager',
        database_manager : 'database/database_manager',
        plugin : 'plugin/plugin'
    }, self);

    var instance = {
        getProduction : function getProduction() {
            return _detectProduction();
        },
        setProduction : function setProduction() {
            _setProduction();
        },
        restart : function restart() {
            var self = this;
            self._log.warn("Refreshing server...");
            self._log.warn("..Flushing Cache...");
            $cache.flush();
            $server.installer.readConfig();
            $cache.set($server.installer.config);
            self._log.warn("..Flushing Schemas...");
            $server.dbi.flushSchemas();
            $server.dbi = new self.database_manager();
            self._log.warn("..Shutting down HTTPServer");
            $server.http_server.shutdown();
            self._log.info("Server startup beginning...");
            this.startup();
        },
        startup : function startup(cb) {
            $server.bower_manager = new self.bower_manager();
            $server.angular_manager = new self.angular_manager();
            $server.client_manager = new self.client_manager();
            async.series({
                getBowerDependencies : function(callback) {
                    $server.bower_manager.readBowerJson();
                    $server.bower_manager.getDependencyFiles();
                    callback();
                },
                getInstalledPlugins : function(callback) {
                    var numberOfPlugins = 0;
                    var pluginNames = _.keys($server.plugin_manager.installedPlugins);
                    _.each(pluginNames, function(pluginName) {
                        new self.plugin(pluginName, function() {
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
        },
        shutdown : function shutdown() {

        }
    };

    var _terminator = function terminator(sig) {
        if ( typeof sig === "string") {
            self._log.error('Received ' + sig + ' - terminating app ...');
            process.exit(1);
        }
        this._log.error('Node server stopped.');
    };

    var _setupTerminationHandlers = function setupTerminationHandlers() {
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

    var _detectProduction = function _detectProduction() {
        var ip = process.env.OPENSHIFT_NODEJS_IP;
        if (!ip) {
            self._log.warn("Detected development environment");
            return false;
        } else {
            self._log.warn("Detected production environment");
            return true;
        }
    };

    var _setProduction = function _setProduction() {
        process.env.OPENSHIFT_NODEJS_IP = '127.0.0.1';
    };

    _setupTerminationHandlers();
    return instance;
}

module.exports = _flow_controller;
