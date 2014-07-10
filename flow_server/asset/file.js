function file(path) {
    this.setFilePath(path);
    this.getFileName();
    return this;
}

file.prototype = {
    fs : require('fs'),
    getFileName : function getFileName() {
        this.fileName = require('path').basename(this.filePath);
        this._log.debug('Setting file name to ' + this.fileName);
        return this;
    },
    setFilePath : function path(path) {
        this._log.debug('Setting file path to ' + path);
        this.filePath = path;
        return this;
    },
    exists : function exists() {
        this._log.debug('Checking existence of file at ' + this.filePath);
        return this.fs.existsSync(this.filePath);
    },
    deleteFile : function deleteFile() {
        try {
            this._log.debug('Removing file at ' + this.filePath);
            this.fs.unlinkSync(this.filePath);
            this._event.emit('file.deleted', this);
        } catch (err) {
            this._log.error('Unable to delete file at ' + this.filePath);
        }
        return this;
    },
    copyFileTo : function copyTo(targetPath) {
        try {
            this._log.debug('Copying file to ' + targetPath);
            this.fs.writeFileSync(targetPath, this.contents);
            this._event.emit('file.copied', this);
        } catch (err) {
            this._log.error('Unable to copy file to ' + newPath);
        }

        return this;
    },
    moveFile : function move(newPath, newFileName) {
        try {
            this._log.debug('Attempting to move file to ' + newPath + newFileName + ' from ' + this.filePath);
            if (this.fs.existsSync(newPath)) {
                this._log.debug('Copying file to ' + newPath + '/' + newFileName);
                this.fs.writeFileSync(newPath + '/' + newFileName, this.contents);
                this._log.debug('Removing old file at ' + this.filePath);
                this.fs.unlinkSync(this.filePath);
                this._log.debug('Setting new path to ' + newPath);
                this.filePath = newPath;
            } else {
                this._log.error('Unable to move file to ' + newPath + ', target path does not exist');
            }
        } catch (err) {
            this._log.error('Unable to move file to ' + newPath);
        }
        this._event.emit('file.moved', this);
        return this;
    },
    readFile : function read() {
        try {
            this.contents = this.fs.readFileSync(this.filePath, 'UTF8');
            this._log.debug('Read file at ' + this.filePath);
        } catch (err) {
            this._log.error('Unable to read file at ' + this.filePath);
        }
        this._event.emit('file.read', this);
        return this;
    },
    writeFile : function write() {
        try {
            this.fs.writeFileSync(this.filePath, this.contents);
            this._log.debug('Wrote file at ' + this.filePath);
            this._event.emit('file.written', this);
        } catch (err) {
            this._log.error('Unable to write file at ' + this.filePath);
        }
        return this;
    },
};

module.exports = file;
