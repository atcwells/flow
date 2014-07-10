function cache_object_store(group, key, value) {
    this._cacheObject = {};
};

cache_object_store.prototype = {
    constructor : cache_object_store,
    flush : function flush() {
        this._log.debug('Cache flushed');
        this._cacheObject = {};
        _server.readConfig();
        return true;
    },
    set : function set(object, relativeObject, path) {
        var self = this;
        if (!path) {
            var path = "$cache.";
        }
        if (!relativeObject) {
            var relativeObject = self._cacheObject;
        }

        for (var key in object) {
            if (_.isString(object[key]) || _.isFunction(object[key])) {
                var debugLine = object[key];
                if (_.isFunction(object[key])) {
                    debugLine = '[Function]';
                }
                if (debugLine.toString().indexOf('\n') > -1) {
                    debugLine = "[File]";
                }
                if (self._cacheObject && relativeObject[key]) {
                    self._log.debug('Overwriting ' + path + key + ' with value: ' + debugLine);
                } else {
                    self._log.debug('Writing ' + path + key + ' with value: ' + debugLine);
                }
                relativeObject[key] = object[key];
            } else {
                if (_.isArray(object[key])) {
                    if (!relativeObject[key]) {
                        relativeObject[key] = [];
                    }
                    _.assign(relativeObject[key], object[key]);
                } else {
                    path += key + '.';
                    if (!relativeObject[key]) {
                        relativeObject[key] = {};
                    }
                    self.set(object[key], relativeObject[key], path);
                    path = path.slice(0, path.length - key.length - 1);
                }
            }
        }
    },
    unset : function unset(keyString) {
        var self = this;
        var keyArray = keyString.split('.');
        var deleteString = "delete self._cacheObject";
        keyArray.forEach(function(key) {
            deleteString += "['" + key + "']";
        });
        deleteString += ";";
        try {
			eval(deleteString);
        } catch (err) {
			self._log.error('Unable to unset cache object at ' + keyString);
        }
    },
    getAll : function getAll() {
        this._log.debug('All Cache objects returned');
        return this._cacheObject;
    },
    get : function get(key) {
        var segments = key.split('.');
        var cacheObject = undefined;
        var self = this;
        segments.forEach(function(key) {
            if (!cacheObject) {
                cacheObject = self._cacheObject[key];
            } else {
                cacheObject = cacheObject[key];
            }
        });
        if (!cacheObject) {
            this._log.debug('Cache object not found with key [' + key + ']');
            return null;
        } else {
            this._log.debug('Cache key [' + key + '] returned');
            return cacheObject;
        }
    },
};

module.exports = cache_object_store;
