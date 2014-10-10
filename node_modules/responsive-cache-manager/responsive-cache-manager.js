module.exports = function init(options) {
	return new cache_manager(options);
};

function cache_manager(optionsObj) {
    var options = optionsObj || {};
    this.logger = {
        debug : (options.logger && options.logger.debug) || console.log,
        info : (options.logger && options.logger.info) || console.log,
        warn : (options.logger && options.logger.war) || console.log,
        error : (options.logger && options.logger.error) || console.log
    };
    this.cacheStrategy = (options.cacheStrategy) ? './cache-strategies/' + options.cacheStrategy : './cache-strategies/object-store';
    this._cache = {};
    this.setup();
    return this;
};

cache_manager.prototype.setup = function setup(cacheStore) {
    this.logger.info('Using Caching Strategy: ' + this.cacheStrategy);
    this._cache = require(this.cacheStrategy)();
    this._cache.logger = this.logger;
    return this;
};

cache_manager.prototype.flush = function flush() {
    return this._cache.flush();
};

cache_manager.prototype.set = function set(value) {
    return this._cache.set(value);
};

cache_manager.prototype.unset = function unset(key) {
    return this._cache.unset(key);
};

cache_manager.prototype.getAll = function getAll() {
    return this._cache.getAll();
};

cache_manager.prototype.get = function get(group, key) {
    return this._cache.get(group, key);
};

cache_manager.prototype.getStats = function get(group, key) {
    return this._cache.getStats(group, key);
};