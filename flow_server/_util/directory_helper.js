function directory_helper(path) {
    this.path = path;
    return this;
};

var fs = require('fs');
var _ = require('lodash-node');

directory_helper.prototype.getDirectories = function getDirectories() {
    var self = this;
    try {
        var directories = fs.readdirSync(self.path);
        directories = _.remove(directories, function(dir) {
            return fs.lstatSync(self.path + '/' + dir).isDirectory();
        });
        return directories;
    } catch (err) {
        this._log.error('Unable to read directory at ' + this.path);
    }
};

directory_helper.prototype.getFiles = function getFiles() {
    var self = this;
    try {
        var files = fs.readdirSync(self.path);
        files = _.remove(files, function(file) {
            return fs.lstatSync(self.path + '/' + file).isFile();
        });
        return files;
    } catch (err) {
        this._log.error('Unable to read directory at ' + this.path);
    }
};

directory_helper.prototype.makeDir = function makeDir() {
    try {
        fs.mkdirSync(this.path);
        this._log.debug('Created directory at path ' + this.path);
    } catch(err) {
        this._log.error('Failed to create directory at path ' + this.path);
    }
};

directory_helper.prototype.exists = function exists() {
    try {
        this._log.debug('Checking directory at path ' + this.path + ' exists');
        return fs.existsSync(this.path);
    } catch(err) {
        this._log.error('Failed to check existence of directory at path ' + this.path);
    }
};

directory_helper.prototype.deleteDirectory = function deleteDirectory() {
    try {
        this._log.debug('Deleting directory at path ' + this.path + ' exists');
        fs.rmdirSync(this.path);
    } catch(err) {
        this._log.error('Failed to delete directory at path ' + this.path);
    }
};

module.exports = directory_helper;

