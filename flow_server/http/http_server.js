var fs = require('fs');
var _log = new $logger('HTTP Server');

function http_server(callback) {
    this.setup();
    this.startup(callback);
    return this;
};

http_server.prototype = {
    constructor : http_server,
    startup : function startup(callback) {
    	var self = this;
        _log.info('HTTP server starting up...');
        this.server = $server.expressapp.listen(self.port, self.ipaddress, function() {
            _log.info('HTTP server started on ' + self.ipaddress + ':' + self.port);
            callback(null, '');
        });
    },
    shutdown : function shutdown() {
        var self = this;
        _log.warn('HTTP server shutting down...');
        self.server.close();
        _log.warn('HTTP server stopped');
    },
    setup : function setup() {
        _log.info('Configuring HTTP server environment');
        this.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        this.port = process.env.OPENSHIFT_NODEJS_PORT || $cache.get('instance_config.port');
        if ( typeof this.ipaddress === "undefined") {
            this.ipaddress = $cache.get('instance_config.ip_address');
            _log.warn('Development environment, using config address [' + this.ipaddress + ']');
        } else {
            _log.info('Production environment configured');
        }
    }
};

module.exports = http_server;
