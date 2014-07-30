angular.module('<%= $cache.get("instance_config.name") %>').controller('adminFieldTypes', ['Hook', '$modal',
function(Hook, $modal) {
    var self = this;
    self.fieldTypes = {};
    self.selectedFieldName = "";
    self.selectedField = {};

    Hook('fields/getFieldTypes', {
    }).then(function(data) {
        self.fieldTypes = data.fieldTypes;
    });

    self.createFieldType = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_newFieldType.html',
            controller : newFieldTypeModalController,
            resolve : {
                objectType : function() {
                    return "View";
                }
            }
        });

        modalInstance.result.then(function(newView) {
            self.fieldTypes[newView.name] = newView.type.toLowerCase();
            Hook('fields/createFieldType', {
                fieldTypes : self.fieldTypes
            }).then(function(data) {
                self.fieldTypes = data.fieldTypes;
            });
        }, function() {
        });
    };

    self.deleteFieldType = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_areYouSure.html',
            controller : areYouSureModalController,
            resolve : {
                message : function() {
                    return "You are about to delete this Field Type permanently, which will cause each schema that uses this field type to revert that column to a String. Are you sure you want to do this?";
                }
            }
        });

        modalInstance.result.then(function(newViewName) {
            Hook('fields/deleteFieldType', {
                view : self.selectedView,
                controller : self.selectedController
            }).then(function(data) {
                self.selectedViewName = "";
                self.selectedView = {};
                self.viewNames = data.viewNames;
            });
        }, function() {
        });
    };
}]); 