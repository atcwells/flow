function _flow_installer() {
    this.startup();
    this.production = this._detectProduction();
    return this;
};

_flow_installer.prototype.startup = function startup() {
    var self = this;
    async.series({
        readConfig : function(callback) {
            self.readConfig();
            callback();
        },
        installCacheManager : function(callback) {
            $cache = new $dir.cache_manager();
            $cache.setup(self.config.cache_config.strategy);
            $cache.set(self.config);
            callback();
        },
        installAssetManager : function(callback) {
            $server.asset_manager = new $dir.asset_manager();
            callback();
        },
        installRouteManager : function(callback) {
            $server.route_manager = new $dir.route_manager();
            callback();
        },
        installPluginManager : function(callback) {
            $server.plugin_manager = new $dir.plugin_manager();
            callback();
        },
        installDatabaseManager : function(callback) {
            $server.dbi = new $dir.database_manager();
            $dbi = $server.dbi.querySchema;
            $dbi2 = $server.dbi.getDBI;
            callback();
        },
    }, function() {
        self._log.info('Flow installation complete');
    });
    return this;
};

_flow_installer.prototype._detectProduction = function detectProduction() {
    var ip = process.env.OPENSHIFT_NODEJS_IP;
    if (!ip) {
        this._log.warn("Detected development environment");
        return false;
    } else {
        this._log.warn("Detected production environment");
        return true;
    }
};

_flow_installer.prototype.readConfig = function readConfig() {
    this._log.info('Reading config from [./config.json]');
    this.config = new $dir.json_file('./config.json').readFile().contents;
    this._log.info('Successfully read config');
    return this;
};

module.exports = _flow_installer;
