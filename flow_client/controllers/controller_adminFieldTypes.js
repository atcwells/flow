angular.module('<%= $cache.get("instance_config.name") %>').controller('adminFieldTypes', ['Hook',
function(Hook) {
	var self = this;
	self.fieldTypes = [];
    self.selectedFieldName = "";
    self.selectedField = {};
	
    Hook('schema/getFieldTypes', {
    }).then(function(data) {
        self.fieldTypes = data.fieldTypes;
        self._getters = new Function(data._getters)();
        self._setters = new Function(data._setters)();
        self._validators = new Function(data._validators)();
        self._defaults = new Function(data._defaults)();
    });
}]);