var bower_manager = require(shell.pwd() + '/flow_server/manager/bower_manager');
var angular_manager = require(shell.pwd() + '/flow_server/manager/angular_manager');
var client_manager = require(shell.pwd() + '/flow_server/manager/client_manager');
var _log = new $logger('Flow Controller');

function _flow_controller() {
    var self = this;

    var instance = {
        getProduction : function getProduction() {
            return _detectProduction();
        },
        setProduction : function setProduction() {
            _setProduction();
        },
        restart : function restart() {
            var self = this;
            _log.warn("Refreshing server...");
            _log.warn("..Flushing Cache...");
            $cache.flush();
            $server.installer.readConfig();
            $cache.set($server.installer.config);
            _log.warn("..Flushing Schemas...");
            $server.dbi.flushSchemas();
            $server.dbi = new database_manager();
            _log.warn("..Shutting down HTTPServer");
            $server.http_server.shutdown();
            _log.info("Server startup beginning...");
            this.startup();
        },
        startup : function startup(cb) {
            $server.bower_manager = new bower_manager();
            $server.angular_manager = new angular_manager();
            $server.client_manager = new client_manager();
            async.series({
                getBowerDependencies : function(callback) {
                    _log.info('Instantiating Bower...');
                    $server.bower_manager.readBowerJson();
                    $server.bower_manager.getDependencyFiles();
                    callback();
                },
                getClientDependencies : function(callback) {
                    _log.info('Instantiating Client...');
                    $server.client_manager.getClientFiles();
                    callback();
                },
                getAngularApplication : function(callback) {
                    _log.info('Instantiating Angular...');
                    $server.angular_manager.searchForAngularModules($server.bower_manager.scriptDependencies);
                    $server.angular_manager.getAngularRoutes(function() {
                        $server.angular_manager.getAngularConstants(callback);
                    });
                }
            }, function() {
                _log.info('Flow configuration complete');
                cb();
            });
        },
        shutdown : function shutdown() {

        }
    };

    var _terminator = function terminator(sig) {
        if ( typeof sig === "string") {
            _log.error('Received ' + sig + ' - terminating app ...');
            process.exit(1);
        }
        this._log.error('Node server stopped.');
    };

    var _setupTerminationHandlers = function setupTerminationHandlers() {
        _log.info('Configuring Manual Termination Handlers');
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
            _log.warn("Detected development environment");
            return false;
        } else {
            _log.warn("Detected production environment");
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
