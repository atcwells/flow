module.exports = function data(request, response, callback) {
    var self = this;
    self.user = (request && request.user && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

    self.properties = {
      responseMechanism : 'sendJSON',
      name : 'data',
      verb : 'post'
    };

    self.read = function(params) {
      $dbi.schema(params.table, self.user._id).find(params.queryFields, function(err, results) {
        if (err) {
            self.response.message.errorMessage = results;
            self.callback(response);
        } else {
          $dbi.getSchemaDefinition(params.table, function(err, data) {
            self.response.message.error = false;
            self.response.message.data.records = results;
            self.response.message.data.structure = data;
            self.callback(response);
          });
        }
      });
    };

    self.update = function(params) {
      $dbi.schema(params.table).updateRecords(null, params.queryFields, params.updateFields, function(err, data) {
        self.read({
          table : params.table,
          queryFields : params.queryFields
        });
      });
    };

    self.create = function(params) {
      $dbi.schema(params.table).createRecord(self.user._id, params.updateFields, function(err, result) {
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
      $dbi.schema(params.table, self.user._id).deleteRecords(params.queryFields, function(err, result) {
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
