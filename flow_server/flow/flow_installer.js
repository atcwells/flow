function flow_installer(cb) {
  var self = this;

  _.include({
    asset_manager : 'manager/asset_manager',
    route_manager : 'http/route_manager',
    json_file : 'file/json_file',
    plugin_manager : 'plugin/plugin_manager'
  }, self);

  var instance = {
    readConfig : function readConfig(callback) {
      self._log.info('Reading config from [./config.json]');
      self.config = new self.json_file('./config.json').readFile().contents;
      self._log.info('Successfully read config');
      callback(null, 'Config read successfully');
    },
    install : function startup() {
      async.series({
        readConfig : function(callback) {
          instance.readConfig(callback);
        },
        installCacheManager : function(callback) {
          $cache = require('responsive-cache-manager')({
          	logger: new $dir._log('$cache'),
          	cacheStrategy : self.config.cache_config.strategy
          });
          $cache.set(self.config);
          callback();
        },
        installAssetManager : function(callback) {
          $server.asset_manager = new self.asset_manager();
          callback();
        },
        installRouteManager : function(callback) {
          $server.route_manager = new self.route_manager();
          callback();
        },
        installPluginManager : function(callback) {
          $server.plugin_manager = new self.plugin_manager();
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
            logger: new $dir._log('$dbi')
          }, callback);
        },
      }, function() {
        self._log.info('Flow installation complete');
        cb();
      });
      return this;
    }
  };

  instance.install();
  return instance;
};

module.exports = flow_installer;
