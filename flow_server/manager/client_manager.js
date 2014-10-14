(function() {

  var fileWalker = require('file');
  var file = require(shell.pwd() + '/flow_server/file/file');

  client_manager.prototype.setupDirectoryWatching = function() {
      var self = this;
      var hound = require('hound');
      var clientDir = $cache.get('client_config.installation_path');
      var watcher = hound.watch(shell.pwd() + clientDir);

      watcher.on('create', function(file, stats) {
          new $dir.file(file).readFile();
      });
      watcher.on('change', function(file, stats) {
          new $dir.file(file).readFile();
      });
  },

  client_manager.prototype.getClientFiles = function() {
      fileWalker.walkSync(shell.pwd() + $cache.get('client_config.installation_path'), function(dirPath, dirs, files) {
      	if(dirPath.indexOf('plugins') === -1){
              if(files.length){
              	_.each(files, function(fileName){
              		new file(dirPath + '/' + fileName).readFile();
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
