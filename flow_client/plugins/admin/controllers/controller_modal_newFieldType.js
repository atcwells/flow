var newFieldTypeModalController = function($scope, $modalInstance, objectType) {
    $scope.objectType = objectType;
    $scope.input = {
        validForm : false,
        type : '',
        newName : ''
    };
    $scope.$watch("input", function(value) {
        if(value.type != '' && value.newName != ''){
        	$scope.input.validForm = true;
        }
    }, true);
    $scope.fieldTypes = ['String', 'Number', 'Date', 'Boolean', 'Objectid'];
    $scope.ok = function() {
        $modalInstance.close({
            name : $scope.input.newName,
            type : $scope.input.type
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
