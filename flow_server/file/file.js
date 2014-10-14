var fs = require('fs');
var _log = new $logger('file');

function file(path) {
    this.setFilePath(path);
    this.getFileName();
    return this;
}

file.prototype = {
    getFileName : function getFileName() {
        this.fileName = require('path').basename(this.filePath);
        _log.debug('Setting file name to ' + this.fileName);
        return this;
    },
    setFilePath : function path(path) {
        _log.debug('Setting file path to ' + path);
        this.filePath = path;
        return this;
    },
    exists : function exists() {
        _log.debug('Checking existence of file at ' + this.filePath);
        return fs.existsSync(this.filePath);
    },
    deleteFile : function deleteFile() {
        try {
            _log.debug('Removing file at ' + this.filePath);
            fs.unlinkSync(this.filePath);
            $event.emit('file.deleted', this);
        } catch (err) {
            _log.error('Unable to delete file at ' + this.filePath);
        }
        return this;
    },
    copyFileTo : function copyTo(targetPath) {
        try {
            _log.debug('Copying file to ' + targetPath);
            fs.writeFileSync(targetPath, this.contents);
            $event.emit('file.copied', this);
        } catch (err) {
            _log.error('Unable to copy file to ' + newPath);
        }

        return this;
    },
    moveFile : function move(newPath, newFileName) {
        try {
            _log.debug('Attempting to move file to ' + newPath + newFileName + ' from ' + this.filePath);
            if (fs.existsSync(newPath)) {
                _log.debug('Copying file to ' + newPath + '/' + newFileName);
                fs.writeFileSync(newPath + '/' + newFileName, this.contents);
                _log.debug('Removing old file at ' + this.filePath);
                fs.unlinkSync(this.filePath);
                _log.debug('Setting new path to ' + newPath);
                filePath = newPath;
            } else {
                _log.error('Unable to move file to ' + newPath + ', target path does not exist');
            }
        } catch (err) {
            _log.error('Unable to move file to ' + newPath);
        }
        $event.emit('file.moved', this);
        return this;
    },
    readFile : function read() {
        try {
            this.contents = fs.readFileSync(this.filePath, 'UTF8');
            _log.debug('Read file at ' + this.filePath);
        } catch (err) {
            _log.error('Unable to read file at ' + this.filePath);
        }
        $event.emit('file.read', this);
        return this;
    },
    writeFile : function write() {
        try {
            fs.writeFileSync(this.filePath, this.contents);
            _log.debug('Wrote file at ' + this.filePath);
            $event.emit('file.written', this);
        } catch (err) {
            _log.error('Unable to write file at ' + this.filePath);
        }
        return this;
    },
    readJsonFile : function() {
        try {
            this.readFile();
            _log.debug('Attempting to parse JSON file at ' + this.filePath);
            this.contents = JSON.parse(this.contents);
            _log.debug('Parsed JSON file at ' + this.filePath);
        } catch(err) {
            _log.error('Unable to parse JSON file at ' + this.filePath);
        }
        return this;
    },
    writeJsonFile : function() {
        try {
            this.contents = JSON.stringify(this.contents, null, 4);
            _log.debug('Attempting to stringify JSON file at ' + this.filePath);
            this.writeFile();
        } catch(err) {
            _log.error('Unable to stringify JSON file at ' + this.filePath);
        }
        return this;
    }
};

module.exports = file;
