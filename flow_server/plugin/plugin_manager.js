function plugin_manager() {
    this.pluginCatalog = {};

    this.installationPath = $cache.get('plugin_config.installation_path');
    this.catalogPath = $cache.get('plugin_config.catalog.path');
    this.requiredPlugins = $cache.get('plugin_config.installed');
    
    this.getCatalog();

    this.installedPlugins = {};
    this.checkInstalledPlugins();
    this.installRequiredPlugins();
    return this;
};

plugin_manager.prototype.getCatalog = function getCatalog() {
    var self = this;
    var pluginDirectories = new $dir.directory_helper(self.catalogPath).getDirectories();
    _.each(pluginDirectories, function(directory) {
        var manifest = new $dir.json_file(self.catalogPath + directory + '/manifest.json').readFile().contents;
        if (manifest) {
            if (!self.pluginCatalog[manifest.name]) {
                self.pluginCatalog[manifest.name] = {};
            }
            self.pluginCatalog[manifest.name].version = manifest.version;
            self.pluginCatalog[manifest.name].directory = self.catalogPath + directory;
        } else {
            self._log.warn('Plugin in Catalog called [' + directory + '] has no manifest file, cannot make it available.');
        }
    });
    return this;
};

plugin_manager.prototype.checkInstalledPlugins = function checkInstalledPlugins() {
    var self = this;
    var installedPluginsDirectories = new $dir.directory_helper(self.installationPath).getDirectories();
    _.each(installedPluginsDirectories, function(directory) {
        var manifest = new $dir.json_file(self.installationPath + directory + '/manifest.json').readFile().contents;
        if (manifest) {
            if (!self.installedPlugins[manifest.name]) {
                self.installedPlugins[manifest.name] = {};
            }
            self.installedPlugins[manifest.name].version = manifest.version;
            self._log.info('Required plugin called [' + directory + '] is installed properly, so not re-installing.');
        } else {
            self._log.warn('Installed plugin called [' + directory + '] has no manifest file, installation seems to be broken so uninstalling...');
            self.uninstallPlugin(directory);
        }
    });
    return this;
};

plugin_manager.prototype.installRequiredPlugins = function installRequiredPlugins() {
    var self = this;
    _.each(self.requiredPlugins, function(plugin, pluginName) {
        if (!self.installedPlugins[pluginName]) {
            self._log.info('Required plugin [' + pluginName + '] is not installed, proceeding to install');
            self.installPlugin(pluginName, plugin.version);
        }
    });
    return this;
};

plugin_manager.prototype.createNewPlugin = function createNewPlugin(name, version) {
    var self = this;
    if (!name || !version) {
        self._log.error('Both name and version are required to create a new plugin');
        return this;
    } else {
        if (new $dir.directory_helper(self.catalogPath + name + '-' + version).exists()) {
            self._log.error('Plugin ' + name + '-' + version + ' already exists, cannot overrite');
        }
        return this;
    }
    new $dir.directory_helper(self.catalogPath + name + '-' + version).makeDir();
    ['controllers', 'database_records', 'database_schema', 'hooks', 'services', 'views'].forEach(function(dir) {
        new $dir.directory_helper(self.catalogPath + name + '-' + version + '/' + dir).makeDir();
    });
    return this;
};

plugin_manager.prototype.upgradePlugin = function upgradePlugin(name, version) {
	var self = this;
    if (self.installedPlugins[name]) {
		self.uninstallPlugin(name);
		self.installPlugin(name, version);
    } else {
		self._log.error('Plugin is not yet installed, cannot be upgraded.');
		return this;
    }
};

plugin_manager.prototype.installPlugin = function installPlugin(name, version) {
    var self = this;
    var plugin_installer = new $dir.plugin_installer(name, version).install();
    if (plugin_installer.error) {
        self._log.error('Plugin [' + name + '] could not be installed');
        return this;
    } else {
        self._log.info('Plugin [' + name + '] successfully installed');
        if (!self.installedPlugins[name]) {
            self.installedPlugins[name] = {};
        }
        self.installedPlugins[name].version = version;
        return this;
    }
};

plugin_manager.prototype.uninstallPlugin = function uninstallPlugin(name) {
    var self = this;
    var plugin_installer = new $dir.plugin_installer(name).uninstall();
    if (plugin_installer.error) {
        self._log.error('Plugin [' + name + '] could not be uninstalled');
        return this;
    } else {
        self._log.info('Plugin [' + name + '] successfully uninstalled');
        if (self.installedPlugins[name]) {
            delete self.installedPlugins[name];
        }
        return this;
    }
};

module.exports = plugin_manager;
