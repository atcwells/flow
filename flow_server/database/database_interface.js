(function() {

    var database_interface = function(schema) {
        this.schema = schema;
        this.schemaDefinition = $cache.get('schema.' + this.schema.schemaDefinition.name);
        return this;
    };

    database_interface.prototype.find = function(queryFields, callback) {
        var self = this;
        var populationFields = _getReferenceFields(self.schemaDefinition.fields);
        if (populationFields) {
            this.schema.model.find(queryFields).populate(populationFields).exec(function(err, data) {
                if (err) {
                    callback(true, 'ERROR: Unable to read table ' + self.schemaDefinition.name);
                } else {
                    callback(null, _convertToObject(data));
                }
            });
        } else {
            this.find(queryFields, function(err, data) {
                if (err) {
                    self.callback(true, 'ERROR: Unable to read table ' + this.schemaDefinition.name);
                } else {
                    callback(null, _convertToObject(data));
                }
            });
        }
    };

    database_interface.prototype.findDistinct = function(distinctField, callback) {
        var self = this;
        this.schema.model.find({}).distinct(distinctField).exec(function(err, data) {
            if (err) {
                callback(true, 'ERROR: Unable to read table ' + self.schemaDefinition.name);
            } else {
                callback(null, data);
            }
        });
    };

    database_interface.prototype.createRecord = function(record, callback) {

    };

    database_interface.prototype.updateRecord = function(record, callback) {

    };

    var _convertObjectsToIds = function(params) {
        for (var key in params.updateFields) {
            if (_.isObject(params.updateFields[key]) && params.updateFields[key]._id) {
                params.updateFields[key] = params.updateFields[key]._id;
            }
        }
    };

    var _getReferenceFields = function(fields) {
        var populationFields = "";
        _.each(fields, function(field, fieldName) {
            if (field.ref) {
                populationFields = (populationFields.length > 0) ? populationFields + " " + fieldName : fieldName;
            }
        });
        return populationFields;
    };

    var _convertToObject = function(results) {
        var responseResults = [];
        for (var key in results) {
            var obj = results[key].toObject();
            for (var field in obj) {
                obj[field] = results[key][field];
            }
            responseResults.push(obj);
        }
        return responseResults;
    };

    module.exports = database_interface;
})();
