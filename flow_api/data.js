module.exports = function data(request, response, callback) {
    var self = this;
    self.user = (request && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

    self.properties = {
        responseMechanism : 'sendJSON',
        name : 'data',
        verb : 'post'
    };

    self.read = function(params) {
        var table = $dbi.schema(params.table, self.user._id);
        table.find(params.queryFields, function(err, results) {
            if (err) {
                self.response.message.errorMessage = results;
                self.callback(response);
            } else {
                self.response.message.error = false;
                self.response.message.data.records = results;
                self.response.message.data.structure = table.schemaDefinition;
                self.callback(response);
            }
        });
    };

    self.update = function(params) {
        var table = $dbi.schema(params.table);
        for (var key in params.updateFields) {
            if (_.isObject(params.updateFields[key]) && params.updateFields[key]._id == null) {
                params.updateFields[key] = '';
            } else if (_.isObject(params.updateFields[key]) && params.updateFields[key]._id != undefined) {
                params.updateFields[key] = params.updateFields[key]._id;
            }
        }
        table.find(params.queryFields, function(err, records) {
            if (err) {
                self.response.message.errorMessage = results;
                self.callback(response);
            } else {
                records.forEach(function(record) {
                    _.each(params.updateFields, function(field, fieldName) {
                        record[fieldName] = field;
                    });
                    record._updated_by = self.user._id;
                    if (record.password) {
                        delete record.password;
                    }
                    record.save(function(error, result) {
                        if (error) {
                            self.response.message.errorMessage = 'ERROR: Unable to save record with id:' + params.queryFields._id;
                            if (error.message) {
                                self.response.message.errorMessage = error.message;
                                self.response.message.errorData = error.errors;
                            }
                            self.callback(response);
                        } else {
                            if ($cache.get('instance_config.production') == 'false') {
                                var dbFile = new $dir.json_file($cache.get('database_config.data_directory') + '/db_record_' + params.table + '_' + result._id + '.json');
                                dbFile.contents = result;
                                dbFile.writeFile();
                            }
                            self.read({
                                table : params.table,
                                queryFields : {
                                    _id : result._id
                                }
                            });
                        }
                    });
                });
            }
        });
    };

    self.create = function(params) {
        var table = $dbi.schema(params.table, self.user._id);
        table.createRecord(params.updateFields, function(err, result) {
            if (err) {
                self.response.message.errorMessage = result;
                self.callback(response);
            } else {
                self.response.message.error = false;
                self.response.message.data.records = result;
                self.callback(response);
            }
        });
    };

    self.remove = function(params) {
        var table = $dbi.schema(params.table, self.user._id);
        table.deleteRecords(params.queryFields, function(err, result) {
            if (err) {
                self.response.message.errorMessage = result;
                self.callback(response);
            } else {
                self.response.message.error = false;
                self.response.message.data.records = result;
                self.callback(response);
            }
        });
    };

    return self;
};
