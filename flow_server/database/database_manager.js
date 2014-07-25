(function() {

    database_manager.prototype._getSchemaDefinitionFiles = function() {
        var self = this;
        schemaDefinitionFiles = [];
        var files = new $dir.directory_helper(self.schemaPath).getFiles();
        if (!files) {
            return schemaDefinitionFiles;
        }
        files.forEach(function(schemaDefinitionFileName, index) {
            if (schemaDefinitionFileName.indexOf('_') !== 0 && schemaDefinitionFileName.indexOf('.') !== 0) {
                schemaDefinitionFiles.push(schemaDefinitionFileName);
            }
        });
        return schemaDefinitionFiles;
    };

    database_manager.prototype._refreshSchema = function(schemaName) {
        this.SchemaManager.decorateSchema(this.schema[schemaName]);
        this.MongoDB.flushSchema(schemaName);
        this.schema[schemaName].model = this.MongoDB.createSchema(schemaName, this.schema[schemaName].schemaDefinition.fields);
    };

    database_manager.prototype.addFieldToSchema = function(schemaName, newField) {
        if (!this.schema[schemaName]) {
            this._log.error('No schema exists with name ' + schemaName);
        } else {
            this.schema[schemaName].addField(newField);
            this._refreshSchema(schemaName);
        }
    };

    database_manager.prototype.removeFieldFromSchema = function(schemaName, fieldName) {
        if (!this.schema[schemaName]) {
            this._log.error('No schema exists with name ' + schemaName);
        } else {
            this.schema[schemaName].removeField(fieldName);
            this._refreshSchema(schemaName);
        }
    };

    database_manager.prototype.alterFieldOnSchema = function(schemaName, fieldName, newProperty) {
        if (!this.schema[schemaName]) {
            this._log.error('No schema exists with name ' + schemaName);
        } else {
            this.schema[schemaName].alterField(fieldName, newProperty);
            this._refreshSchema(schemaName);
        }
    };

    database_manager.prototype.querySchema = function(schemaName) {
        var self = this;
        if (schemaName && $server.dbi.schema[schemaName]) {
            return $server.dbi.schema[schemaName].model;
        }
    };
    
    database_manager.prototype.getDBI = function(schemaName) {
        var self = this;
        if (schemaName && $server.dbi.schema[schemaName]) {
            return new $dir.database_interface($server.dbi.schema[schemaName]);
        }
    };

    database_manager.prototype.alterSchema = function(schemaName, schemaFields) {
        this.removeSchema(schemaName);
        this.addSchema(schemaName, schemaFields);
    };

    database_manager.prototype.addSchema = function(schemaName, schemaFields) {
        if (!schemaFields)
            scehamFields = {};
        var self = this;
        if (this.schema[schemaName]) {
            this._log.error('Schema already exists with name ' + schemaName);
        } else {
            var schemaFile = new $dir.json_file(self.schemaPath + schemaName + '.json');
            _.each(schemaFields, function(field, fieldName) {
                _.each(field, function(property, propertyName) {
                    if (property === true) {
                        schemaFields[fieldName][propertyName] = "true";
                    }
                    if (property === false) {
                        schemaFields[fieldName][propertyName] = "false";
                    }
                });
            });
            schemaFile.contents = {
                name : schemaName,
                fields : schemaFields
            };
            schemaFile.writeFile();
            self.schema[schemaName] = new $dir.schema(self.schemaPath, schemaName + '.json');
            self.SchemaManager.decorateSchema(self.schema[schemaName]);
            var schemaDefinition = self.schema[schemaName].schemaDefinition;
            self.schema[schemaName].readSchema();
            self.schema[schemaName].model = self.MongoDB.createSchema(schemaDefinition.name, schemaDefinition.fields);
        }
    };

    database_manager.prototype.removeSchema = function(schemaName) {
        var archiveLocation = this.schemaPath + 'bak/';
        var archiveFileName = schemaName + '.json.removedschema.' + new $dir.date_helper().constructFileDate();
        this.schema[schemaName].schemaFile.moveFile(archiveLocation, archiveFileName);
        this.MongoDB.flushSchema(schemaName);
        delete this.schema[schemaName];
    };

    database_manager.prototype.flushSchemas = function() {
        this.MongoDB.flushSchemas();
    };

    function database_manager(schemaName) {

        var self = this;
        self.SchemaManager = new $dir.schema_manager();
        self.MongoDB = new $dir.mongodb();
        self.schema = {};
        self.schemaPath = $cache.get('database_config.schema_directory');

        var schemaDefinitionFiles = self._getSchemaDefinitionFiles();

        schemaDefinitionFiles.forEach(function(filename, index) {
            var schemaName = filename.slice(0, filename.length - 5);

            self.schema[schemaName] = new $dir.schema(self.schemaPath, filename);
            self.SchemaManager.decorateSchema(self.schema[schemaName]);
            var schemaDefinition = self.schema[schemaName].schemaDefinition;
            self.schema[schemaName].model = self.MongoDB.createSchema(schemaDefinition.name, schemaDefinition.fields);
        });
    };

    module.exports = database_manager;
})();

