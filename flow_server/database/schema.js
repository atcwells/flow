(function() {

    schema.prototype.writeSchema = function() {
        this.schemaFile.writeFile();
        this._log.info('Schema definition written for ' + this.schemaDefinition.name + ']');
        this.readSchema();
    };

    schema.prototype.readSchema = function() {
        this.schemaFile = new $dir.json_file(this.schemaPath + this.schemaFileName).readFile();
        this.schemaDefinition = this.schemaFile.contents;

        var cacheSchema = {
            schema : {}
        };
        cacheSchema.schema[this.schemaDefinition.name] = this.schemaDefinition;
        this._log.info('Schema definition read for [' + this.schemaDefinition.name + ']');
        $cache.set(cacheSchema);
    };

    schema.prototype.addField = function(newField) {
        if (this.schemaDefinition[newField.name]) {
            this._log.error('Schema field already exists with name ' + newField.name);
        } else {
            this.schemaDefinition.fields[newField.name] = newField.field;
            this._log.info('Schema field added with name ' + newField.name);
        }
    };

    schema.prototype.removeField = function(fieldName) {
        if (!this.schemaDefinition.fields[fieldName]) {
            this._log.error('Schema field doesn\'t exists with name ' + fieldName);
        } else {
            delete this.schemaDefinition.fields[fieldName];
            this._log.info('Schema field removed with name ' + fieldName);
        }
    };

    schema.prototype.alterField = function(fieldName, newProperty) {
        if (!this.schemaDefinition.fields[fieldName]) {
            this._log.error('Schema field doesn\'t exists with name ' + fieldName);
        } else {
            this.schemaDefinition.fields[fieldName][newProperty.name] = newProperty.value;
            this._log.info('Schema field altered where name is ' + fieldName);
        }
    };

    function schema(path, filename) {
        this.schemaDefinition = {};

        this.schemaPath = path;
        this.schemaFileName = filename;

        if (new $dir.file(this.schemaPath + this.schemaFileName).exists()) {
            this.readSchema();
        } else {
            this._log.error('Schema created, but JSON definition doesn\'t exist yet ' + filename);
        }
    };

    module.exports = schema;
})();
