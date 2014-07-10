(function() {

    var file = require('file');

    client_manager.prototype.setupDirectoryWatching = function() {
        var self = this;
        var hound = require('hound');
        var clientDir = $cache.get('instance_config.client_directory');
        var watcher = hound.watch(clientDir.slice(0, clientDir.length - 1));

        watcher.on('create', function(file, stats) {
            new $dir.file(file).readFile();
        });
        watcher.on('change', function(file, stats) {
            new $dir.file(file).readFile();
        });
    },
    
    client_manager.prototype.getClientFiles = function() {
        file.walkSync($cache.get('instance_config.client_directory'), function(dirPath, dirs, files) {
        	if(dirPath.indexOf('plugins') === -1){
                if(files.length){
                	_.each(files, function(file){
                		new $dir.file('./' + dirPath + '/' + file).readFile();
                	});
                }
        	}
        });
    };

    function client_manager() {
    	this.setupDirectoryWatching();
    };

    module.exports = client_manager;
})();
