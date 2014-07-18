return function data(response, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.read = function(params) {
        var table = $dbi(params.table);
        var tableSchema = $cache.get('schema.' + params.table);
        var populationFields = "";
        _.each(tableSchema.fields, function(field, fieldName) {
            if (field.ref) {
                populationFields = (populationFields.length > 0) ? populationFields + " " + fieldName : fieldName;
            }
        });
        if (!table) {
            self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
            self.callback();
        } else {
            table.find(params.queryFields).populate(populationFields).exec(function(err, results) {
                if (err) {
                    self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                    self.callback();
                } else {
                    var responseResults = [];
                    for (var key in results) {
						var obj = results[key].toObject();
						for (var field in obj){
							obj[field] = results[key][field];
						}
						responseResults.push(obj);
                    }
                    self.response.message.error = false;
                    self.response.message.data.records = responseResults;
                    self.response.message.data.structure = tableSchema;
                    self.callback();
                }
            });
        }
    };

    self.readDistinct = function(params) {
        var table = $dbi.querySchema(params.table);
        table.find().distinct(params.distinctField, function(err, results) {
            if (err) {
                self.response.message.errorMessage = 'ERROR: Unable to read table ' + params.table;
                self.callback();
            } else {
                self.response.message.error = false;
                self.response.message.data.records = results;
                self.response.message.data.structure = $cache.get('schema.' + params.table);
                self.callback();
            }
        });
    };

    self.update = function(params) {
        var table = $dbi(params.table);
        if (params.queryFields._id) {
            table.findOne({
                _id : params.queryFields._id
            }, function(err, record) {
                if (err) {
                    self.response.message.errorMessage = 'ERROR: Unable to find record with id:' + params.queryFields._id;
                    self.callback();
                } else {
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
                }
            });
        } else {
            self.response.message.errorMessage = 'ERROR: No _id specified, unable to update.';
            self.callback();
        }
    };

    self.create = function(params) {
        var table = $dbi(params.table);
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
