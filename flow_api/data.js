return function data(response, user, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;
    self.user = user;

    self.read = function(params) {
        var table = $dbi2(params.table, self.user._id);
        table.find(params.queryFields, function(err, results) {
            if (err) {
                self.response.message.errorMessage = results;
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.records = results;
                self.response.message.data.structure = table.schemaDefinition;
                self.callback();
            }
        });
    };

    self.update = function(params) {
        var table = $dbi(params.table);
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
                self.callback();
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
                        if (!$server.controller.production) {
                            var dbFile = new $dir.json_file($cache.get('database_config.data_directory') + '/db_' + params.table + '_' + result._id + '.json');
                            dbFile.contents = result;
                            dbFile.writeFile();
                        }
                        if (error) {
                            self.response.message.errorMessage = 'ERROR: Unable to save record with id:' + params.queryFields._id;
                            if (error.message) {
                                self.response.message.errorMessage = error.message;
                                self.response.message.errorData = error.errors;
                            }
                            self.callback();
                        } else {
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
        var table = $dbi2(params.table, self.user._id);
        table.createRecord(params.updateFields, function(err, result) {
            if (err) {
                self.response.message.errorMessage = result;
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.records = result;
                self.callback();
            }
        });
    };

    self.remove = function(params) {
        var table = $dbi2(params.table, self.user._id);
        table.deleteRecords(params.queryFields, function(err, result) {
            if (err) {
                self.response.message.errorMessage = result;
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.records = result;
                self.callback();
            }
        });
    };

    return self;
};
