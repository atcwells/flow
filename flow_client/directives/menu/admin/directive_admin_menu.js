angular.module('<%= $cache.get("instance_config.name") %>').directive('adminMenu', ['Hook',
function(Hook) {
    return {
        restrict : 'E',
        templateUrl : '/view/admin_menu.html',
        scope : {
            data : '='
        },
        link : function(scope, element, attributes) {
            scope.adminMenuGroups = [];
            scope.refreshMenu = function(){
                Hook('system/getAdminInfo', {}).then(function(data) {
                    scope.adminMenuGroups = [];
                    angular.forEach(data.menu_groups, function(group) {
                        var menuItem = {
                            heading : group.name,
                            submenuItems : []
                        };
                        angular.forEach(data.menu_items, function(menu_item) {
                            if (menu_item.menu_group === group._id) {
                                menuItem.submenuItems.push(menu_item);
                            }
                        });
                        scope.adminMenuGroups.push(menuItem);
                    });
                }); 
            };
            scope.refreshMenu();
        }
    };
}]);
