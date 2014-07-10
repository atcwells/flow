(function() {

    var file = require('file');

    api_manager.prototype.setupDirectoryWatching = function() {
        var self = this;
        var hound = require('hound');
        var apiDir = $cache.get('instance_config.api_directory');
        var watcher = hound.watch(apiDir.slice(0, apiDir.length - 1));

        watcher.on('create', function(file, stats) {
            // self.assetLibrary[fileType][assetObject.filePath].readFile();
        });
        watcher.on('change', function(file, stats) {
            new $dir.javascript_file(file).readFile();
        });
    },

    api_manager.prototype.getAPIFiles = function() {
    	var apiDirectory = $cache.get('instance_config.api_directory');
        file.walkSync(apiDirectory, function(dirPath, dirs, files) {
            if (files.length) {
                _.each(files, function(file) {
                    new $dir.javascript_file(dirPath + file).readFile();
                });
            }
        });
    };

    function api_manager() {
    	this.setupDirectoryWatching();
    };

    module.exports = api_manager;
})();
