function plugin(pluginName, callback) {
    var self = this;

    _.include({
        file : 'file/file',
        fileHelper : 'file'
    }, self);

    self.pluginPath = $cache.get('plugin_config.installation_path') + pluginName;
    self.pluginName = pluginName;

    var instance = {
        getClientFiles : function() {
            self.fileHelper.walkSync(self.pluginPath, function(dirPath, dirs, files) {
                if (files.length && dirPath.indexOf('database') === -1) {
                    _.each(files, function(file) {
                        new self.file('./' + dirPath + '/' + file).readFile();
                    });
                }
            });
        }
    };

    instance.getClientFiles();
    callback(null, pluginName);
};

module.exports = plugin;
