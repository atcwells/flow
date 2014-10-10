module.exports = init = function(obj) {
	return new defaultCacheObject();
};

var defaultCacheObject = function(obj, key) {
	this.key = key;
	this.reads = 0;
	this.writes = 0;
	this.obj = obj || {};

	this.write = function(obj) {
		this.writes++;
		this.obj = obj;
	};

	this.read = function() {
		this.reads++;
		return this.obj;
	};

	this.stats = function() {
		return {
			reads: this.reads,
			writes: this.writes
		}
	}
};
