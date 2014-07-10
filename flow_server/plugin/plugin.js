var file = require('file');

plugin.prototype.getClientFiles = function() {
    file.walkSync(this.pluginPath, function(dirPath, dirs, files) {
        if (files.length && dirPath.indexOf('database') === -1) {
            _.each(files, function(file) {
                new $dir.file('./' + dirPath + '/' + file).readFile();
            });
        }
    });
};

plugin.prototype.installPluginRecords = function() {
    var self = this;
    var dirHelper = new $dir.directory_helper(this.pluginPath + '/database_records');
    if (dirHelper.exists()) {
        var files = dirHelper.getFiles();
        _.each(files, function(file) {
            var recordFile = new $dir.json_file(self.pluginPath + '/database_records/' + file).readFile();
            var recordJson = recordFile.contents;
            $dbi(recordJson.schema).findById(recordJson.record._id, function(err, record) {
                if (!err && record) {
                    var model = $dbi(recordJson.schema);
                    newRecord = model(recordJson.record);
                    newRecord.save(function(err, result) {
                        self._log.info('Plugin record did not exist in database, so created: ' + file);
                    });
                } else {
                    self._log.info('Plugin record already exists in database, so not re-created: ' + file);
                }
                self._event.emit('file.unmount', recordFile);
            });
        });
    }
};

function plugin(pluginName, callback) {
    this.pluginPath = $cache.get('plugin_config.installation_path') + pluginName;
    this.pluginName = pluginName;

    this.getClientFiles();
    this.installPluginRecords();
    callback();
};

module.exports = plugin;
