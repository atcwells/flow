function json_file(filePath) {
    $dir.file.call(this, filePath);
    return this;
};

json_file.prototype.readFile = function readFile() {
    try {
        this._super.readFile.call(this);
        this._log.debug('Attempting to parse JSON file at ' + this.filePath);
        this.contents = JSON.parse(this.contents);
        this._log.debug('Parsed JSON file at ' + this.filePath);
    } catch(err) {
        this._log.error('Unable to parse JSON file at ' + this.filePath);
    }
    return this;
};

json_file.prototype.writeFile =function write() {
    try {
        this.contents = JSON.stringify(this.contents, null, 4);
        this._log.debug('Attempting to stringify JSON file at ' + this.filePath);
        this._super.writeFile.call(this);
    } catch(err) {
        this._log.error('Unable to stringify JSON file at ' + this.filePath);
    }
    return this;
};

_.inheritPrototype(json_file, $dir.file);
module.exports = json_file;
