var areYouSureModalController = function($scope, $modalInstance, message) {
    $scope.message = message;
    $scope.ok = function() {
        $modalInstance.close(true);
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
