angular.module('<%= $cache.get("instance_config.name") %>').controller('recordForm', ['Hook', '$routeParams', '$compile', '$scope', '$timeout',
function(Hook, $routeParams, $compile, $scope, $timeout) {
    var self = this;
    self.recordTable = $routeParams.table;
    self.originalRecord = {};
    self.record = {};

    self.getRecord = function(id) {
        self.promise = Hook('data/read', {
            table : $routeParams.table,
            queryFields : {
                _id : id
            }
        }).then(function(data) {
            if (!data.records) {
                return;
            }
            self.record = data.records[0];
            self.originalRecord = angular.copy(data.records[0]);
            self.structure = data.structure;
            $timeout(function() {
                for (var field in self.structure.fields) {
                    if (!self.record) {
                        self.record = {};
                    }
                    if (!self.record[field]) {
                        self.record[field] = "";
                    }
                    if (self.structure.fields[field].visible == 'true') {
                        var newEl = angular.element("<div field-model='recordForm.record." + field + "' field-name='" + field + "' json-data='" + angular.toJson(self.structure.fields[field]) + "' class='input-" + self.structure.fields[field].type + "'></div>");
                        angular.element('#' + field).append(newEl);
                        $compile(newEl)($scope);
                    } else {
						if(self.structure.fields[field].ref){
							self.record[field] = self.structure.fields[field]._id;
						}
                    }
                }
            });
        });
    };

    self.createNewRecord = function() {
        self.record = {};
    };

    self.saveRecord = function() {
        if (!self.record._id) {
            method = 'create';
        } else {
            method = 'update';
        }
        Hook('data/' + method, {
            table : self.recordTable,
            queryFields : {
                _id : self.record._id
            },
            updateFields : self.record
        }).then(function(data) {
            self.record = data.record;
            self.originalRecord = angular.copy(self.record);
            self.validationErrors = {};
    	console.log(self.record);
        }, function(error) {
            self.record = angular.copy(self.originalRecord);
            self.validationErrors = error.errorData;
        });
    };

    self.deleteRecord = function() {
        if (self.record._id) {
            Hook('data/remove', {
                table : self.recordTable,
                queryFields : {
                    _id : self.record._id
                }
            }).then(function(data) {
                self.record = {};
            });
        }
    };

    self.getRecord($routeParams._id);
}]);
