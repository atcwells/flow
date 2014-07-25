return function data(response, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.read = function(params) {
        var table = $dbi2(params.table);
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
            if (_.isObject(params.updateFields[key]) && params.updateFields[key]._id != undefined) {
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
                    record.save(function(error, result) {
                        if (error) {
                            self.response.message.errorMessage = 'ERROR: Unable to save record with id:' + params.queryFields._id;
                            if (error.message) {
                                self.response.message.errorMessage = error.message;
                                self.response.message.errorData = error.errors;
                            }
                            self.callback();
                        } else {
                            self.response.message.data.record = result;
                            self.response.message.error = false;
                            self.callback();
                        }
                    });
                });
            }
        });
    };

    self.create = function(params) {
        var table = $dbi(params.table);
        for (var key in params.updateFields) {
            if (_.isObject(params.updateFields[key]) && params.updateFields[key]._id) {
                params.updateFields[key] = params.updateFields[key]._id;
            }
        }
        var record = table(params.updateFields);
        record.save(function(err, result) {
            if (err) {
                self.response.message.errorMessage = 'ERROR: Unable to save new record';
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.record = result;
                self.callback();
            }
        });
    };

    self.remove = function(params) {
        var table = $dbi(params.table);
        table.findById(params.queryFields._id, function(err, record) {
            if (err || !record) {
                self.response.message.errorMessage = 'ERROR: Unable to find record with id: ' + params.queryFields._id;
                self.callback();
            } else {
                record.remove(function(err, results) {
                    if (err) {
                        self.response.message.errorMessage = 'ERROR: Unable to delete record with id: ' + params.queryFields._id;
                        self.callback();
                    } else {
                        self.response.message.error = false;
                        self.response.message.data.records = results;
                        self.callback();
                    }
                });
            }
        });
    };

    return self;
};
