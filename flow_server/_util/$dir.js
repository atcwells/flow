function _directory_builder(path) {
    var self = this;
    this.file = require('file');

    console.log('***************************************************************************');
    console.log('  Beginning server preload.');

    $dir = this;

    this.discoverLibraries(path);
    this.setupDecoratedLibraries();

    console.log('  Finished server preload.');
    console.log('***************************************************************************');
    return this;
};

_directory_builder.prototype = {
    constructor : _directory_builder,
    discoverLibraries : function(path) {
        console.log('  Walking ' + path + ' to find .js files...');
        var self = this;
        this.file.walkSync(path, function(dirPath, dirs, files) {
            _.each(files, function(file) {
                if (file.indexOf('.js') === file.length - 3) {
                    console.log('    Found library ' + file + ', adding to Directory');
                    // Strip off the trailing .js.
                    var fileName = file.slice(0, file.length - 3);
                    self[fileName] = require(dirPath + '/' + fileName);
                } else {
                    if (file.indexOf('_') === 0) {
                        console.log('    Ignoring ' + file + ' beacuse it\s a protected javascript file');
                    } else {
                        console.log('    Ignoring ' + file + ' because it\'s not a javascript file');
                    }
                }
            });
        });
    },
    setupDecoratedLibraries : function() {
        console.log('  Instantiating Directory Interface.');
        var self = this;
        var events = require('events');
        _event = new events.EventEmitter();
        _.each(self, function(prop, propName) {
            if (prop.prototype) {
                console.log('    Extending ' + propName + ' with Logger (_log)');
                prop.prototype._log = new self._log(propName);
                console.log('    Extending ' + propName + ' with EventEmitter (_event)');
                prop.prototype._event = _event;
            }
        });
    }
};

module.exports = _directory_builder;
