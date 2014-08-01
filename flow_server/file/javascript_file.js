function javascript_file(filePath) {
    $dir.file.call(this, filePath);
    return this;
}

javascript_file.prototype = {
	constructor: javascript_file,
	properties : {
        inherits : "file",
    },
	readFile : function readFile(filePath) {
        this._super.readFile.call(this);
        try {
            var func = new Function(this.contents);
            this.func = func();
        } catch (exc) {
            this._log.error('Unable to eval javascript file: ' + this.filePath + ' it appears to be invalid Javascript.');
        }
        return this;
    },
    writeFile : function writeFile() {
        this._super.writeFile.call(this);
        return this;
    }
};

module.exports = javascript_file;
