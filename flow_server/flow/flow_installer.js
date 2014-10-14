var asset_manager = require(shell.pwd() + '/flow_server/manager/asset_manager');
var route_manager = require(shell.pwd() + '/flow_server/http/route_manager');
var file = require(shell.pwd() + '/flow_server/file/file');
var _log = new $logger('Flow Controller');

function flow_installer(cb) {
  var self = this;

  var instance = {
    readConfig : function readConfig(callback) {
      _log.info('Reading config from [./config.json]');
      self.config = new file(shell.pwd() + '/config.json').readJsonFile().contents;
      _log.info('Successfully read config');
      callback(null, 'Config read successfully');
    },
    install : function startup() {
      async.series({
        readConfig : function(callback) {
          instance.readConfig(callback);
        },
        installCacheManager : function(callback) {
          $cache = require('responsive-cache-manager')({
          	logger: new $logger('$cache'),
          	cacheStrategy : self.config.cache_config.strategy
          });
          $cache.set(self.config);
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
          var RDM = require('responsive-database-manager');
          $dbi = RDM({
            mongoUrl: $cache.get('database_config.uri'),
            schemaDirectory: $cache.get('database_config.schema_directory'),
            useMongooseFixes: true,
            backupRecords: true,
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
