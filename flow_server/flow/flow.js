_ = require('lodash-node');
async = require('async');
require(process.env.PWD + '/flow_server/_util/$utils');

$dir = require(process.env.PWD + '/flow_server/_util/$dir');
$cache = {};
$server = {};
$dbi = {};

$server.startup = function() {
    var self = this;
    $dir = new $dir(process.env.PWD + '/flow_server');

    _.include({
        flow_installer : 'flow/flow_installer',
        flow_controller : 'flow/flow_controller',
        http_server : 'http/http_server',
        express : 'express'
    }, self);

    async.series({
        preload : function(callback) {
            var logger = require(process.env.PWD + '/flow_server/_util/_log');
            self._log = new logger('Flow');
            self._log.info('Instantiated directory interface.');
            callback();
        },
        install : function(callback) {
            self._log.info('Installing flow components.');
            $server.installer = new self.flow_installer(callback);
        },
        setup : function(callback) {
            self._log.info('Installing flow components.');
            $server.controller = new self.flow_controller();
            $server.controller.startup(callback);
        },
        setupExpress : function(callback) {
            $server.expressapp = self.express();
            callback();
        },
        setupRoutes : function(callback) {
            $server.route_manager.setup();
            callback();
        },
        start : function(callback) {
            self._log.info('Starting HTTP Server.');
            $server.http_server = new self.http_server();
            callback();
        }
    }, function() {
        self._log.info('Flow setup complete.');
    });

};

$server.startup();
