(function() {
    // (1) Strict mode
    "use strict";

    mongodb.prototype.setupDecorators = function() {
        var defaults = $cache.get('database_config._defaults');
        for (var key in defaults) {
            this.generator.setDefault(key, defaults[key]);
        }
        var validators = $cache.get('database_config._validators');
        for (var key in validators) {
            this.generator.setValidator(key, validators[key]);
        }
        var setters = $cache.get('database_config._setters');
        for (var key in setters) {
            this.generator.setSetter(key, setters[key]);
        }
        var getters = $cache.get('database_config._getters');
        for (var key in getters) {
            this.generator.setGetter(key, getters[key]);
        }
    };

    mongodb.prototype.createSchema = function(schemaName, schemaFields) {
        this._log.info('Creating schema called ' + schemaName);
        var fields = this.convertFieldTypes(schemaFields);
        var Schema = this.generator.schema(schemaName, fields);
        return Schema;
    };

    mongodb.prototype.convertFieldTypes = function(schemaFields) {
        this.schemaPath = $cache.get('database_config.schema_directory');
        var fieldTypes = new $dir.json_file(this.schemaPath + '_field_types.json').readFile().contents;
        var fields = {};
        $cache.set({
        	database_config: {
        		_field_types: fieldTypes
        	}
        });
        _.each(schemaFields, function(schemaField, fieldName) {
            var field = schemaField;
            field.type = fieldTypes[schemaField.type.toLowerCase()];
            delete field.read_only;
            delete field.mandatory;
            delete field.visible;
            fields[fieldName] = field;
        });
        return fields;
    };

    mongodb.prototype.flushSchemas = function() {
        delete this.mongoose.connection.base.models;
        this.mongoose.connection.base.models = {};
        delete this.mongoose.connection.base.modelSchemas;
        this.mongoose.connection.base.modelSchemas = {};
        delete this.mongoose.connection.base.collections;
        this.mongoose.connection.base.collections = {};
    };

    mongodb.prototype.flushSchema = function(schemaName) {
    	this._log.info('Flushing schema with name [' + schemaName + ']');
        if (this.mongoose.connection.base.collections && this.mongoose.connection.base.collections[schemaName]) {
            delete this.mongoose.connection.base.collections[schemaName];
        }
        if (this.mongoose.connection.base.modelSchemas && this.mongoose.connection.base.modelSchemas[schemaName]) {
            delete this.mongoose.connection.base.modelSchemas[schemaName];
        }
        if (this.mongoose.connection.base.models && this.mongoose.connection.base.models[schemaName]) {
            delete this.mongoose.connection.base.models[schemaName];
        }
    };

    function mongodb() {
        this.schemas = {};

        var mongoUrl = process.env.OPENSHIFT_MONGODB_DB_URL;
        if (mongoUrl == undefined) {
            var host = $cache.get('database_config.host');
            var dbName = $cache.get('database_config.name');
            mongoUrl = 'mongodb://' + host + '/' + dbName;
        }
        
        this.mongoose = require('mongoose');
        this.mongoose.connect(mongoUrl);
        this.generator.setConnection(this.mongoose);
        this.generator = require('mongoose-gen');

        this._log.info('Connected to MongoDB at ' + host);

        this.setupDecorators();
    };

    module.exports = mongodb;
})();
