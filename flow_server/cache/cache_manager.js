function cache_manager() {
    this._cache = {};
};

cache_manager.prototype = {
    constructor : cache_manager,
    properties : {
    },
    setup : function setup(cacheStore) {
        this._log.info('Using Caching Strategy: ' + cacheStore);
        this._cache = new $dir[cacheStore]();
    },
    flush: function flush() {
        return this._cache.flush();
    },
    set: function set(value) {
        return this._cache.set(value);
    },
    unset: function unset(key) {
    	return this._cache.unset(key);
    },
    getAll : function getAll() {
        return this._cache.getAll();
    },
    get : function get(group, key) {
        return this._cache.get(group, key);
    }
};

module.exports = cache_manager;