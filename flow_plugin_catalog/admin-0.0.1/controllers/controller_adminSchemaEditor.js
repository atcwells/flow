angular.module('<%= $cache.get("instance_config.name") %>').controller('adminSchemaEditor', ['Hook', '$modal', '$log',
function(Hook, $modal, $log) {
    var self = this;
    self.selectedTable = {};
    self.updatingName = false;
    self.viewNameOptions = {
        allowClear : true
    };

    Hook('schema/getSchemaNames', {
        params : {}
    }).then(function(data) {
        self.tables = data.schemaNames;
        self.fieldTypes = data.fieldTypes;
    });

    self.selectTable = function() {
        if (self.selectedTable.name != null) {
            Hook('schema/getSchema', {
                table : self.selectedTable.name
            }).then(function(data) {
                self.selectedTable = data.schemaDefinition;
            });
        }
    };

    self.updateName = function() {
		self.updatingName = true;
    };

    self.addField = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_enterName.html',
            controller : ModalInstanceCtrl,
            resolve : {
                objectType : function() {
                    return "Field";
                }
            }
        });

        modalInstance.result.then(function(newSchemaName) {
            console.log(self.selectedTable.fields);
            if (!self.selectedTable.fields[newSchemaName]) {
                self.selectedTable.fields[newSchemaName] = {};
            }
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };

    self.deleteField = function(fieldName) {
        delete self.selectedTable.fields[fieldName];
    };

    self.saveSchema = function() {
    	angular.forEach(self.selectedTable.fields, function(field){
    		delete field.updatingName;
    	});
        Hook('schema/saveSchema', {
            name : self.selectedTable.name,
            schema : self.selectedTable.fields
        }).then(function(data) {
            // self.selectedTable = data.table;
        });
    };

    self.deleteSchema = function() {
        Hook('schema/deleteSchema', {
            name : self.selectedTable.name,
        }).then(function(data) {
            if (data) {
                self.tables = data.schemaNames;
                self.selectedTable = {};
            }
        });
    };

    self.createSchema = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_enterName.html',
            controller : ModalInstanceCtrl,
            resolve : {
                objectType : function() {
                    return "Schema";
                }
            }
        });

        modalInstance.result.then(function(newSchemaName) {
            Hook('schema/createSchema', {
                name : newSchemaName,
            }).then(function(data) {
                self.tables = data.schemaNames;
                self.selectedTable = data.schemaDefinition;
            });
        }, function() {
            // $log.info('Modal dismissed at: ' + new Date());
        });
    };
}]);

var ModalInstanceCtrl = function($scope, $modalInstance, objectType) {
    $scope.objectType = objectType;
    $scope.input = {};
    $scope.ok = function() {
        $modalInstance.close($scope.input.newName);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
