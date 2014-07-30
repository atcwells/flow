return function schema(response, user, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.getFieldTypes = function(params) {
        self.response.message.error = false;
        self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
        self.callback();
    };
    
    self.createFieldType = function(params) {
    	self.response.message.error = false;
        var fieldTypes = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_field_types.json');
        fieldTypes.contents = params.fieldTypes;
        fieldTypes.writeFile();
        $cache.set({
        	database_config: {
        		_field_types: params.fieldTypes
        	}
        });
        self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
        self.callback();
    };

    self.getMiddleware = function(params) {
        self.response.message.error = false;
        self.response.message.data._getters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_getters.js').contents;
        self.response.message.data._setters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_setters.js').contents;
        self.response.message.data._defaults = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_defaults.js').contents;
        self.response.message.data._validators = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_validators.js').contents;
        self.callback();
    };

    self.saveGetters = function(params) {
        var getters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_getters.js');
        getters.contents = params._getters;
        getters.writeFile();
        self.response.message.data._getters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_getters.js').contents;
        self.response.message.error = false;
        self.callback();
    };
    
    self.saveSetters = function(params) {
        var setters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_setters.js');
        setters.contents = params._setters;
        setters.writeFile();
        self.response.message.data._setters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_setters.js').contents;
        self.response.message.error = false;
        self.callback();
    };
    
    self.saveDefaults = function(params) {
        var defaults = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_defaults.js');
        defaults.contents = params._defaults;
        defaults.writeFile();
        self.response.message.data._defaults = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_defaults.js').contents;
        self.response.message.error = false;
        self.callback();
    };
    
    self.saveValidators = function(params) {
        var validators = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_validators.js');
        validators.contents = params._validators;
        validators.writeFile();
        self.response.message.data._validators = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_validators.js').contents;
        self.response.message.error = false;
        self.callback();
    };

    return self;
};
