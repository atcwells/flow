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
            Hook('system/getAdminInfo', {}).then(function(data) {
                angular.forEach(data.records, function(link) {
                    if (link.menu_group === "") {
                        var menuItem = {
                            heading : link.name,
                            submenuItems : []
                        };
                        angular.forEach(data.records, function(submenuLink) {
                            if (submenuLink.menu_group === link.name) {
                                menuItem.submenuItems.push(submenuLink);
                            }
                        });
                        scope.adminMenuGroups.push(menuItem);
                        scope.installedPlugins = data.installedPlugins;
                    }
                });
            });
        }
    };
}]);
