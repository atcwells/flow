angular.module('<%= $cache.get("instance_config.name") %>').controller('adminFieldMiddleware', ['Hook',
function(Hook) {
    var self = this;

    Hook('fields/getMiddleware', {
    }).then(function(data) {
        self._getters = data._getters;
        self._setters = data._setters;
        self._validators = data._validators;
        self._defaults = data._defaults;
    });
    
    self.aceChanged = function(evt) {
    	console.log(evt);
    };

    self.saveGetters = function() {
        Hook('fields/saveGetters', {
        	_getters: self._getters
        }).then(function(data) {
            self._getters = data._getters;
        });
    };
    
    self.saveSetters = function() {
        Hook('fields/saveSetters', {
        	_setters: self._setters
        }).then(function(data) {
            self._setters = data._setters;
        });
    };
    
    self.saveValidators = function() {
        Hook('fields/saveValidators', {
        	_validators: self._validators
        }).then(function(data) {
            self._validators = data._validators;
        });
    };
    
    self.saveDefaults = function() {
        Hook('fields/saveDefaults', {
        	_defaults: self._defaults
        }).then(function(data) {
            self._defaults = data._defaults;
        });
    };
}]); 