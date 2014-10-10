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
      $dbi.getSchemaDefinition(params.name, function(err, def) {
        self.response.message.error = false;
        self.response.message.data.schemaDefinition = def;
        $dbi.getFieldTypes(function(err, types) {
          self.response.message.data.fieldTypes = types;
          self.callback(response);
        });
      });
    };

    self.getSchemaNames = function(params) {
      $dbi.getSchemaNames(function(err, names) {
        self.response.message.data.schemaNames = names;
        self.response.message.error = false;
        $dbi.getFieldTypes(function(err, types) {
          self.response.message.data.fieldTypes = types
          self.callback(response);
        });
      });
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

              $dbi.getSchemaNames(function(err, names) {
                self.response.message.data.schemaNames = names;
                self.callback(response);
              });
            });
        } catch (err) {
            self.response.message.errorMessage = "ERROR: Unable to delete schema";
            self.callback(response);
        }
    };

    self.createSchema = function(params) {
        try {
          $dbi.addSchema(params.name, {}, function(err, msg) {
            self.response.message.error = false;
            $dbi.getSchemaNames(function(err, names) {
              self.response.message.data.schemaNames = names;

              $dbi.getSchemaDefinition(params.name, function(err, def) {
                self.response.message.data.schemaDefinition = def

                $dbi.getFieldTypes(function(err, types) {
                  self.response.message.data.fieldTypes = types;
                  self.callback(response);
                });
              });
            });
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
