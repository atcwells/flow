(function() {

    schema_manager.prototype.getMandatoryComponents = function() {
        var self = this;
        ['_mandatory_fields', '_mandatory_properties'].forEach(function(element, index) {
            self[element] = new $dir.json_file(self.schemaPath + element + '.json').readFile().contents;
            var cachedElement = {
                database_config : {}
            };
            self._log.info('Caching ' + element + ' for database schema');
            cachedElement.database_config[element] = new $dir.json_file(self.schemaPath + element + '.json').readFile().contents;
            $cache.set(cachedElement);
        });
    };

    schema_manager.prototype.getDecorators = function() {
        var self = this;
        ['_getters', '_setters', '_defaults', '_validators'].forEach(function(element, index) {
            self[element] = new $dir.javascript_file(self.schemaPath + element + '.js').readFile().func;
            var cachedElement = {
                database_config : {}
            };
            self._log.info('Caching ' + element + ' for database schema');
            cachedElement.database_config[element] = {};
            for (var key in self[element]) {
                cachedElement.database_config[element][key] = self[element][key];
            }
            $cache.set(cachedElement);
        });
    };

    schema_manager.prototype.decorateMandatoryFields = function(schemaDefinition) {
        var self = this;
        if (!schemaDefinition.fields) {
            schemaDefinition.fields = {};
        }
        _.each(self._mandatory_fields, function(mandatoryField, fieldName) {
            if (!schemaDefinition.fields[fieldName]) {
                var field = {};
                field[fieldName] = mandatoryField;
                _.assign(schemaDefinition.fields, field);
            }
        });
    };

    schema_manager.prototype.decorateMandatoryProperties = function(schemaDefinition) {
        var self = this;
        _.each(self._mandatory_properties, function(property, propertyName) {
            _.each(schemaDefinition.fields, function(field, fieldName) {
                if (!field[propertyName]) {
                    schemaDefinition.fields[fieldName][propertyName] = property;
                }
            });
        });
    };

    schema_manager.prototype.decorateAllMongoExtras = function(schemaDefinition) {
        var self = this;
        _.each(schemaDefinition.fields, function(field, fieldName) {
            ['_getters', '_setters', '_defaults', '_validators'].forEach(function(element, index) {
                if (self[element] && self[element][field.type]) {
                    if (element === '_validators') {
                        schemaDefinition.fields[fieldName].validate = field.type;
                    } else if (element === '_defaults') {
                        schemaDefinition.fields[fieldName]['default'] = field.type;
                    } else if (element === '_setters') {
                        schemaDefinition.fields[fieldName].set = field.type;
                    } else if (element === '_getters') {
                        schemaDefinition.fields[fieldName].get = field.type;
                    }
                } else {
                    if (element === '_validators' && schemaDefinition.fields[fieldName].validate) {
                        delete schemaDefinition.fields[fieldName].validate;
                    } else if (element === '_defaults' && schemaDefinition.fields[fieldName]['default']) {
                        delete schemaDefinition.fields[fieldName]['default'];
                    } else if (element === '_setters' && schemaDefinition.fields[fieldName].set) {
                        delete schemaDefinition.fields[fieldName].set;
                    } else if (element === '_getters' && schemaDefinition.fields[fieldName].get) {
                        delete schemaDefinition.fields[fieldName].get;
                    }
                }
            });
        });
    };

    schema_manager.prototype.decorateSchema = function(Schema) {
        var self = this;
        var schemaDefinition = Schema.schemaDefinition;
        self.decorateMandatoryFields(schemaDefinition);
        self.decorateMandatoryProperties(schemaDefinition);
        self.decorateAllMongoExtras(schemaDefinition);
        Schema.writeSchema();
    };

    function schema_manager() {
        var self = this;

        self.schemaPath = $cache.get('database_config.schema_directory');

        self.getMandatoryComponents();
        self.getDecorators();
    }


    module.exports = schema_manager;
})();
