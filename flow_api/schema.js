return function schema(response, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.getSchema = function(params) {
        var schema = $cache.get('schema.' + params.table);
        if (schema) {
            self.response.message.error = false;
            self.response.message.data.schemaDefinition = $cache.get('schema.' + params.table);
            self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
            self.callback();
        } else {
            self.response.message.errorMessage = "ERROR: Unable to find schema called: " + params.table;
            self.callback();
        }
    };
    
    self.getFieldTypes = function(params) {
        self.response.message.error = false;
        self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
        self.response.message.data._getters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_getters.js').contents;
        self.response.message.data._setters = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_setters.js').contents;
        self.response.message.data._defaults = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_defaults.js').contents;
        self.response.message.data._validators = $server.asset_manager.get($cache.get('database_config.schema_directory') + '_validators.js').contents;
        self.callback();
    };

    self.getSchemaNames = function(params) {
        self.response.message.data.schemaNames = self._getSchemaNames();
        self.response.message.error = false;
        self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
        self.callback();
    };

    self.saveSchema = function(params) {
        try {
            $server.dbi.alterSchema(params.name, params.schema);
            self.response.message.error = false;
            self.callback();
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to modify schema";
            self.callback();
        }
    };

    self.deleteSchema = function(params) {
        try {
            $server.dbi.removeSchema(params.name);
            $cache.unset('schema.' + params.name);
            self.response.message.error = false;
            self.response.message.data.schemaNames = self._getSchemaNames();
            self.callback();
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to delete schema";
            self.callback();
        }
    };

    self.createSchema = function(params) {
        try {
            $server.dbi.addSchema(params.name);
            self.response.message.error = false;
            self.response.message.data.schemaNames = self._getSchemaNames();
            self.response.message.data.schemaDefinition = $cache.get('schema.' + params.name);
            self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
            self.callback();
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to delete schema";
            self.callback();
        }
    };

	/*
	 * Private methods
	 */

    self._getSchemaNames = function() {
        var schemaDefs = $cache.get('schema');
        var schemaNames = [];
        for (var key in schemaDefs) {
            schemaNames.push(key);
        }
        return schemaNames;
    };

    return self;
};
