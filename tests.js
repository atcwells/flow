express = require('express');
ExpressApp = express();
_dbi = {};
_cache = {};
_dir = {};
_server = {};

function DirectoryBuilder(path) {
    var self = this;
    var file = require('file');
    var _ = require('lodash-node');

    console.log('***************************************************************************');
    console.log('  Beginning server preload.');
    console.log('  Walking ' + path + ' to find .js files...');
    file.walkSync(path, function(dirPath, dirs, files) {
        if (dirPath.indexOf('plugin_catalog') === -1) {
            _.each(files, function(file) {
                if (file.indexOf('.js') === file.length - 3 && file.indexOf('_') !== 0) {
                    console.log('    Found library ' + file + ', adding to Directory');
                    // Strip off the trailing .js.
                    var fileName = file.slice(0, file.length - 3);
                    self[fileName] = require('./' + dirPath + '/' + fileName);
                } else {
                    if (file.indexOf('_') === 0) {
                        console.log('    Ignoring ' + file + ' beacuse it\s a protected javascript file');
                    } else {
                        console.log('    Ignoring ' + file + ' because it\'s not a javascript file');
                    }
                }
            });
        }
    });

    _dir = self;
    console.log('  Instantiating Directory Interface.');
    _.each(self, function(prop, propName) {
        console.log('    Extending ' + propName + ' with Logger (_log)');
        prop.prototype._log = new self.Logger(propName);
        console.log('    Extending ' + propName + ' with Validator (_val)');
        prop.prototype._val = new self.Validator(propName);
    });
    console.log('  Finished server preload.');
    console.log('***************************************************************************');
};

function Boss() {

    var fs = require('fs');
    var _ = require('lodash-node');
    var async = require('async');
    var self = this;

    // Instantiate our directory and it's objects.
    new DirectoryBuilder('./server');
    self._log = new _dir.Logger('Boss');
    self._log.info('Instantiated Directory Interface.');

    async.series({
        readConfig : function(callback) {
            self._log.info('Instantiating Node Manager');
            _server = new _dir.NodeManager();
            _server.readConfig();
            callback();
        },
        initCache : function(callback) {
            self._log.info('Instantiating Cache Manager with strategy: ' + _server.config.cache_config.strategy);
            _cache = new _dir.CacheManager();
            _cache.setup(_server.config.cache_config.strategy);
            callback();
        },
        cacheConfig : function(callback) {
            self._log.info('Caching config file');
            _cache.set(_server.config);
            callback();
        },
        databaseSetup : function(callback) {
            self._log.info('Instantiating DBI object');
            _dbi = new _dir.DatabaseManager();
            callback();
        },
        liveReloadSetup : function(callback) {
            if (!_server.production) {
                livereload = require('express-livereload');
                livereload(ExpressApp, config = {
                    watchDir : './client'
                });
            }
            callback();
        },
        installPlugins : function(callback) {
            self._log.info('Installing Plugins.');
            self.PluginManager = new _dir.PluginManager().installAllPlugins(callback);
        },
        serverSetup : function(callback) {
            self._log.info('Starting Server Controller.');
            _server.serverStartup();
            callback();
        }
    }, function() {
        // executes `pwd`
        new _dir.BowerManager().installPackage('angular-bootstrap', function(message) {
            console.log(message);

            new _dir.BowerManager().uninstallPackage('angular-bootstrap', function(message) {
                console.log(message);
            });
        });
    });

    function exampleMethods() {

        _cache.getAll();

        _dbi.removeFieldFromSchema('user', 'last_name');

        _dbi.addFieldToSchema('user', {
            name : 'last_name',
            field : {
                type : 'string'
            }
        });

        _dbi.alterFieldOnSchema('user', 'last_name', {
            name : 'type',
            value : 'email'
        });

        _dbi.removeSchema('test');

        _dbi.addSchema('test');
    }

}

var s1 = new Boss();
