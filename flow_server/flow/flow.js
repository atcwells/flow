_ = require('lodash-node');
async = require('async');
require(process.env.PWD + '/flow_server/_util/$utils');

$dir = require(process.env.PWD + '/flow_server/_util/$dir');
$cache = {};
$server = {};
$dbi = {};

$server.startup = function() {
    var self = this;

    async.series({
        preload : function(callback) {
            $dir = new $dir(process.env.PWD + '/flow_server');
            self._log = new $dir._log('Flow');
            self._log.info('Instantiated directory interface.');
            callback();
        },
        install : function(callback) {
            self._log.info('Installing flow components.');
            $server.installer = new $dir._flow_installer();
            callback();
        },
        setup : function(callback) {
            self._log.info('Installing flow components.');
            $server.controller = new $dir._flow_controller();
            $server.controller.startup(callback);
        },
        setupExpress : function(callback) {
            express = require('express');
            $server.expressapp = express();
            callback();
        },
        setupRoutes : function(callback) {
            $server.route_manager.setup();
            callback();
        },
        start : function(callback) {
            self._log.info('Starting HTTP Server.');
            $server.http_server = new $dir.http_server();
            callback();
        }
    }, function() {
        self._log.info('Flow setup complete.');
    });

};

$server.startup();
