var newViewModalController = function($scope, $modalInstance, objectType) {
    $scope.objectType = objectType;
    $scope.input = {};
    $scope.upperCaseMatch = /[A-Z]/g;
    $scope.ok = function() {
        $modalInstance.close({
            name : $scope.input.newName,
            route_url : angular.element(document.querySelector('#route_url'))[0].value,
            route_template : angular.element(document.querySelector('#route_template'))[0].value,
            route_controller : angular.element(document.querySelector('#route_controller'))[0].value,
        });
    };
    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
};
