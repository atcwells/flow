module.exports = function schema(request, response, callback) {
    var self = this;
    self.user = (request && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

	self.properties = {
		responseMechanism: 'sendJSON',
		name: 'schema',
		verb: 'post'
	};

    self.getSchema = function(params) {
        var schema = $cache.get('schema.' + params.table);
        if (schema) {
            self.response.message.error = false;
            self.response.message.data.schemaDefinition = $cache.get('schema.' + params.table);
            self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
            self.callback(response);
        } else {
            self.response.message.errorMessage = "ERROR: Unable to find schema called: " + params.table;
            self.callback(response);
        }
    };

    self.getSchemaNames = function(params) {
        self.response.message.data.schemaNames = self._getSchemaNames();
        self.response.message.error = false;
        self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
        self.callback(response);
    };

    self.saveSchema = function(params) {
        try {
            $dbi.changeSchema(params.name, params.schema, function(err, msg) {
              self.response.message.error = false;
              self.callback(response);
            });
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to modify schema";
            self.callback(response);
        }
    };

    self.deleteSchema = function(params) {
        try {
            $dbi.removeSchema(params.name, function(err, msg) {
              $cache.unset('schema.' + params.name);
              self.response.message.error = false;
              self.response.message.data.schemaNames = self._getSchemaNames();
              self.callback(response);
            });
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to delete schema";
            self.callback(response);
        }
    };

    self.createSchema = function(params) {
        try {
          $dbi.setupSchema(params.name, {}, function(err, msg) {
            self.response.message.error = false;
            self.response.message.data.schemaNames = self._getSchemaNames();
            self.response.message.data.schemaDefinition = $cache.get('schema.' + params.name);
            self.response.message.data.fieldTypes = $cache.get('database_config._field_types');
            self.callback(response);
          });
        } catch (err) {
          self.response.message.errorMessage = "ERROR: Unable to delete schema";
          self.callback(response);
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
