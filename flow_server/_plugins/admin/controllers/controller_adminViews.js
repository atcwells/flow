angular.module('<%= $cache.get("instance_config.name") %>').controller('adminViews', ['Hook', '$scope', 'toaster', '$routeParams', '$modal',
function(Hook, $scope, toaster, $routeParams, $modal) {
    var self = this;
    self.viewNames = [];
    self.selectedViewName = {};
    self.selectedView = {};
    self.selectedController = {};

    Hook('view/getViewNames', {
    }).then(function(data) {
        self.viewNames = data.viewNames;
    });

    self.selectView = function() {
        if (self.selectedViewName != null && self.selectedViewName) {
            Hook('view/getView', {
                view : angular.fromJson(self.selectedViewName).path
            }).then(function(data) {
                self.selectedView = data.view;
                self.selectedController = data.controller;
            });
        }
    };

    self.saveView = function() {
        Hook('view/save', {
            view : self.selectedView,
            controller : self.selectedController
        }).then(function(data) {
            // console.log(data);
        });
    };

    self.createView = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_newView.html',
            controller : newViewModalController,
            resolve : {
                objectType : function() {
                    return "View";
                }
            }
        });

        modalInstance.result.then(function(newView) {
            Hook('view/createView', {
                name : newView.name,
                route_url : newView.route_url,
                route_template : newView.route_template,
                route_controller : newView.route_controller,
            }).then(function(data) {
                var newView = {
                    path : data.view.filePath,
                    name : data.view.fileName
                };
                self.viewNames.push(newView);
                self.selectedViewName = newView;
                self.selectedView = data.view;
                self.selectedController = data.controller;
            });
        }, function() {
        });
    };

    self.deleteView = function() {
        var modalInstance = $modal.open({
            templateUrl : 'view/modal_areYouSure.html',
            controller : areYouSureModalController,
            resolve : {
                message : function() {
                    return "You are about to delete this view and controller permanently, are you sure you want to do this?";
                }
            }
        });

        modalInstance.result.then(function(newViewName) {
            Hook('view/deleteView', {
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

