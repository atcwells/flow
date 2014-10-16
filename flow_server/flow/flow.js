_ = require('lodash-node');
async = require('async');
shell = require('shelljs');
var express = require('express');
var events = require('events');

require(process.env.PWD + '/flow_server/util/$utils');

$logger = require(process.env.PWD + '/flow_server/util/$logger');
$event = new events.EventEmitter();
$cache = {};
$server = {};
$dbi = {};

var flow_installer = require(shell.pwd() + '/flow_server/flow/flow_installer');
var flow_controller = require(shell.pwd() + '/flow_server/flow/flow_controller');
var http_server = require(shell.pwd() + '/flow_server/http/http_server');
var file = require(shell.pwd() + '/flow_server/file/file');

$server.startup = function() {
    var self = this;

    async.series({
        preload : function(callback) {
            self._log = new $logger('Flow Core');
            self._log.info('Instantiated directory interface.');
            callback();
        },
        readConfig : function(callback) {
            self._log.info('Reading config from [./config.json]');
            self.config = new file(shell.pwd() + '/config.json').readJsonFile().contents;
            self._log.info('Successfully read config');
            callback();
        },
        install : function(callback) {
            self._log.info('Installing flow components.');
            $server.installer = new flow_installer(self.config, callback);
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
