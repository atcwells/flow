var newViewModalController = function($scope, $modalInstance, objectType) {
    $scope.objectType = objectType;
    $scope.input = {};
    $scope.ok = function() {
        $modalInstance.close($scope.input.newName);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
