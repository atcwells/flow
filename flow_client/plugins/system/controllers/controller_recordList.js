angular.module('<%= $cache.get("instance_config.name") %>').controller('recordList', ['Hook', '$scope', 'toaster', '$routeParams', '$timeout',
function(Hook, $scope, toaster, $routeParams, $timeout) {
    var self = this;
    self.recordList = [];
    self.recordTable = $routeParams.table;
    self.selectedRows = [];
    self.columnDefinitions = [];

    self.gridOptions = {
        data : 'recordList.recordList',
        enableCellSelection : true,
        enableRowSelection : false,
        columnDefs : 'recordList.columnDefinitions',
    };

    self.createNewRecord = function() {
        self.recordList.push({
            name : '...',
        });
    };

    self.selectRow = function(row) {
        row.selected = !row.selected;
        if (row.selected) {
            self.selectedRows.push(row.entity._id);
        } else {
            // remove from selectedRows
        }
    };

    self.deleteSelectedRecords = function() {
        Hook('data/remove', {
            table : $routeParams.table,
            queryFields : self.selectedRows
        }).then(function(data) {
        	console.log(data.records);
        	console.log(self.recordList);
        	
            angular.forEach(self.recordList, function(record, index) {
            	console.log(data.records.indexOf(record._id));
                if (data.records.indexOf(record._id)) {
                	//TODO: Fix this twatty thing.
                	console.log('Removing: ' + index);
                    self.recordList.splice(index, 1);
                }
            });
        });
    };

    self.getRecords = function() {
        self.promise = Hook('data/read', {
            table : $routeParams.table,
            queryFields : ""
        }).then(function(data) {
            self.columnDefinitions.push({
                enableCellEdit : false,
                cellTemplate : '<span class="text-center"><a ng-click="recordList.selectRow(row);" class="glyphicon glyphicon-circle-arrow-right"></a></span>',
                width : '26px',
            });
            angular.forEach(data.structure.fields, function(field, fieldName) {
                if (field.visible) {
                    var structureObject = {
                        field : fieldName,
                        enableCellEdit : !(field.read_only == 'true') ? true : false
                    };
                    if (field.display_name) {
                        structureObject.displayName = field.display_name;
                    }
                    if (fieldName === 'name') {
                        structureObject.cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/record_form/{{recordList.recordTable}}/{{row.entity._id}}">{{COL_FIELD}}</a></div>';
                    }
                    if (field.ref) {
                        structureObject.cellTemplate = '<div class="ngCellText" ng-class="col.colIndex()"><a href="#/record_form/' + field.ref + '/{{COL_FIELD._id}}">{{COL_FIELD.display_name}}</a></div>';
                    }
                    self.columnDefinitions.push(structureObject);
                }
            });
            self.recordList = data.records;
        });
    };

    $scope.$on('ngGridEventStartCellEdit', function(evt) {
        self.currentlyEditedCellValue = angular.copy(evt.targetScope.row.entity);
    });

    $scope.$on('ngGridEventEndCellEdit', function(evt) {
        if (angular.equals(self.currentlyEditedCellValue, evt.targetScope.row.entity)) {
            return;
        }
        var rowEdited = evt.targetScope.row.entity;
        if (rowEdited._id) {
            var action = 'update';
        } else {
            var action = 'create';
        }
        Hook('data/' + action, {
            table : $routeParams.table,
            queryFields : {
                _id : rowEdited._id
            },
            updateFields : rowEdited
        }).then(function(data) {
            self.recordList.splice(evt.targetScope.row.rowIndex, 1, angular.copy(data.records[0]));
            evt.targetScope.row.entity = angular.copy(data.records[0]);
        }, function(error) {
            evt.targetScope.row.entity = angular.copy(self.currentlyEditedCellValue);
        });
    });

    self.getRecords();
}]);
