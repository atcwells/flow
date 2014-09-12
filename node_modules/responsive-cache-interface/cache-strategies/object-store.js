var _ = require('lodash-node');

module.exports = function init() {
	return new cache_object_store();
};

var cache_object_store = function cache_object_store() {
    this._cacheObject = {};
    return this;
};

cache_object_store.prototype.flush = function flush() {
    this.logger.debug('Cache flushed');
    this._cacheObject = {};
};

cache_object_store.prototype.set = function set(object, relativeObject, path) {
    var self = this;
    if (!path) {
        var path = "$cache:";
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
                self.logger.debug('Overwriting ' + path + key + ' with value: ' + debugLine);
            } else {
                self.logger.debug('Writing ' + path + key + ' with value: ' + debugLine);
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
};

cache_object_store.prototype.unset = function unset(keyString) {
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
};

cache_object_store.prototype.getAll = function getAll() {
    this.logger.debug('All Cache objects returned');
    return this._cacheObject;
};

cache_object_store.prototype.get = function get(key) {
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
        this.logger.debug('Cache object not found with key [' + key + ']');
        return null;
    } else {
        this.logger.debug('Cache key [' + key + '] returned');
        return cacheObject;
    }
};
