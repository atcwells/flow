var asset_manager = require(shell.pwd() + '/flow_server/manager/asset_manager');
var route_manager = require(shell.pwd() + '/flow_server/http/route_manager');
var RDM = require('responsive-database-manager');
var RCM = require('responsive-cache-manager');
var _log = new $logger('Flow Controller');

function flow_installer(config, cb) {
  var self = this;

  var instance = {
    install : function startup() {
      async.series({
        installCacheManager : function(callback) {
          $cache = RCM({
          	logger: new $logger('$cache'),
          	cacheStrategy : config.cache_config.strategy
          }, function(err, cacheManager){});
          callback();
        },
        setConfig : function(callback) {
          $cache.set(config);
          callback();
        },
        installAssetManager : function(callback) {
          $server.asset_manager = new asset_manager();
          callback();
        },
        installRouteManager : function(callback) {
          $server.route_manager = new route_manager();
          callback();
        },
        installDatabaseManager : function(callback) {
          self.mongoose = require('mongoose');
          self.mongoose.connect($cache.get('database_config.uri'));
          $dbi = RDM({
            mongoUrl: $cache.get('database_config.uri'),
            schemaDirectory: $cache.get('database_config.schema_directory'),
            useMongooseFixes: true,
            mongoose: self.mongoose,
            backupRecords: true,
            wipeSchemas: false,
            backupDirectory: $cache.get('database_config.data_directory'),
            logger: new $logger('$dbi')
          }, callback);
        },
      }, function() {
        _log.info('Flow installation complete');
        cb();
      });
      return this;
    }
  };

  instance.install();
  return instance;
};

module.exports = flow_installer;
