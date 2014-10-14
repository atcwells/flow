_ = require('lodash-node');
async = require('async');
shell = require('shelljs');
var express = require('express');
var events = require('events');

require(process.env.PWD + '/flow_server/util/$utils');

$logger = require(process.env.PWD + '/flow_server/util/_log');
$dir = require(process.env.PWD + '/flow_server/util/$dir');
$cache = {};
$event = new events.EventEmitter();
$server = {};
$dbi = {};

var flow_installer = require(shell.pwd() + '/flow_server/flow/flow_installer');
var flow_controller = require(shell.pwd() + '/flow_server/flow/flow_controller');
var http_server = require(shell.pwd() + '/flow_server/http/http_server');

$server.startup = function() {
    var self = this;
    // $dir = new $dir(shell.pwd() + '/flow_server');

    async.series({
        preload : function(callback) {
            self._log = new $logger('Flow Core');
            self._log.info('Instantiated directory interface.');
            callback();
        },
        install : function(callback) {
            self._log.info('Installing flow components.');
            $server.installer = new flow_installer(callback);
        },
        setup : function(callback) {
            self._log.info('Installing flow components.');
            $server.controller = new flow_controller();
            $server.controller.startup(callback);
        },
        setupExpress : function(callback) {
            $server.expressapp = express();
            callback();
        },
        setupRoutes : function(callback) {
            $server.route_manager.setup(callback);
        },
        start : function(callback) {
            self._log.info('Starting HTTP Server.');
            $server.http_server = new http_server(callback);
        }
    }, function() {
        self._log.info('Flow setup complete.');
    });

};

$server.startup();
