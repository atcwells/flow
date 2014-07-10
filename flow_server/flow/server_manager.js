function server_manager() {
    this.asset_manager = new $dir.asset_manager();
    this._setupTerminationHandlers();
    this.production = this._detectProduction();
    return this;
}

server_manager.prototype = {
    constructor : server_manager,
    sys : require('sys'),
    exec : require('child_process').exec,
    readConfig : function readConfig() {
        this._log.info('Reading config from [./config.json]');
        this.config = new $dir.json_file('./config.json').read().contents;
        this._log.info('Successfully read config');
        return this;
    },
    childProcessCommand : function childProcessCommand(command, callback) {
        var self = this;
        exec(command, function(error, stdout, stderr) {
            if (error !== null) {
                self._log.error('Failed to run command: ' + error);
                callback(error);
                return;
            } else {
                self._log.debug('Ran command: ' + command);
                callback(stdout);
            }
        });
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
        $server.dbi = new $dir.DatabaseManager();
        self._log.warn("..Shutting down HTTPServer");
        self.webserver.shutdown();
        self._log.info("Server startup beginning...");
        this.serverStartup();
    },
    startup : function startup() {
        var self = this;
        self._log.info("Instantiating Webserver objects");
        self.plugin_manager = {};
        self.client_manager = {};
        self.bower_manager = {};
        self.angular_manager = {};
        self.route_manager = {};
        self.http_server = {};
        async.series({
            initializeExpress : function initializeExpress(callback) {
                var express = require('express');
                self.expressapp = express();
                callback();
            },
            pluginSetup : function(callback) {
                self._log.info("Configuring plugins...");
                self.PluginManager = new $dir.PluginManager().setupAllPlugins();
                callback();
            },
            bowerSetup : function bowerSetup(callback) {
                self._log.info("Configuring plugins complete");
                self._log.info("Configuring Bower...");
                self.bower_manager = new $dir.bower_manager();
                callback();
            },
            clientSetup : function(callback) {
                self._log.info("Configuring Bower complete");
                self._log.info("Configuring client...");
                self.ClientManager = new $dir.ClientManager();
                callback();
            },
            indexPageSetup : function(callback) {
                self._log.info("Configuring client complete");
                self._log.info("Configuring Index Page...");
                // self.IndexManager = new $dir.IndexManager();
                callback();
            },
            angularSetup : function(callback) {
                self._log.info("Configuring Index Page complete");
                self._log.info("Configuring Angular...");
                // self.AngularManager = new $dir.AngularManager();
                callback();
            },
            routeSetup : function(callback) {
                self._log.info("Configuring Angular complete");
                self._log.info("Configuring Routes...");
                self.route_manager = new $dir.route_manager();
                self.route_manager.setupRoutes();
                callback();
            },
            httpServer : function(callback) {
                self._log.info("Configuring Routes complete");
                self._log.info("Instantiating Webserver...");
                // Insantiate the webserver.
                self.http_server = new $dir.http_server();
                callback();
            }
        }, function() {
            self._log.info("Instantiating Webserver complete");
        });
    },
    _setupTerminationHandlers : function setupTerminationHandlers() {
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
    },
    _terminator : function terminator(sig) {
        if ( typeof sig === "string") {
            this._log.error('Received ' + sig + ' - terminating app ...');
            process.exit(1);
        }
        this._log.error('Node server stopped.');
    },
    _detectProduction : function detectProduction() {
        var ip = process.env.OPENSHIFT_NODEJS_IP;
        if (!ip) {
            this._log.warn("Detected development environment");
            return false;
        } else {
            this._log.warn("Detected production environment");
            return true;
        }
    },
};

module.exports = server_manager;
