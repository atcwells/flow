angular.module('one', [
	'<%= $cache.get("angular.import_modules").join("', \n	'") %>'
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider<% _.each($cache.get('angular.routes'), function(route){ %>
		.when('/<%= route.name %>', {
    		controller: '<%= route.controller %>',
    		templateUrl: '/view/<%= route.templateUrl %>'
    	})<% }) %>
}])<% _.each($cache.get('angular.constants'), function(constantGroup, groupName){ %>
.constant('<%= groupName %>', {
<% _.each(constantGroup, function(constant){ %>	<%= constant.name%>: '<%= constant.value %>',
<% }) %>})<% }) %>
.run([function() {
}]);

flow = {};
