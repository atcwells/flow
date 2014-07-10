var fs = require('fs-extra');

function plugin_installer(pluginName, version) {
    this.name = pluginName;
    this.version = version;
    this.installationPath = $cache.get('plugin_config.installation_path');
    this.catalogPath = $cache.get('plugin_config.catalog.path');
}

plugin_installer.prototype.install = function install() {
    var self = this;
    self._log.debug('Installing Plugin [' + this.name + ']...');
    if (!self.name) {
        self.error = true;
        self._log.error('Unable to install plugin without name');
        return self;
    }
    if (!self.version) {
        self.error = true;
        self._log.error('Unable to install plugin without version');
        return self;
    }

    if (!new $dir.directory_helper(self.name).exists()) {
        self._log.info('Plugin directory does not exist, creating...');
        new $dir.directory_helper(self.installationPath + self.name).makeDir();
    } else {
        self.error = true;
        self._log.warn('Plugin directory already exists, but installation seems to be broken');
        return self;
    }

    self._log.info('Copying plugin files to destination');

    if (!new $dir.directory_helper(self.catalogPath + self.name + '-' + self.version).exists()) {
        self.error = true;
        self._log.warn(pluginName + ' plugin at version ' + self.version + ' does not exist, not proceeding with installation');
        return self;
    }
    
    fs.copySync(self.catalogPath + self.name + '-' + self.version, self.installationPath + self.name);
    
    self._log.debug('Plugin [' + self.name + '] installed');
    return self;
};

plugin_installer.prototype.uninstall = function uninstall() {
    var self = this;
    self._log.debug('Uninstalling Plugin [' + self.name + ']...');
    if (!self.name) {
        self.error = true;
        self._log.error('Unable to install plugin without name');
        return this;
    }

    var pluginInstallationPath = self.installationPath + self.name + '/';
    fs.removeSync(pluginInstallationPath);

    self._log.debug('Plugin [' + self.name + '] Uninstalled');
    return this;
};

module.exports = plugin_installer;
