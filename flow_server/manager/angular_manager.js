function angular_manager() {
    this.angularModules = [];
    return this;
};

angular_manager.prototype.searchForAngularModules = function searchForAngularModules(files) {
    var self = this;
    _.each(files, function(file) {
        if (file.indexOf('.js') === (file.length - 3)) {
            self.searchFileForAngularModules(file);
        }
    });
    $cache.set({
        angular : {
            import_modules : self.angularModules,
        }
    });
    return this;
};

angular_manager.prototype.searchFileForAngularModules = function searchFileForAngularModules(dep) {
    var self = this;
    var file = new $dir.file('.' + dep).readFile().contents;
    var strip = require('strip-comments');
    file = strip(file);
    var angularModuleRegex = /angular.module\([\"\']([a-zA-Z0-9\.\-]*)[\"\']\, ?\[/g;
    var match = angularModuleRegex.exec(file);
    while (match) {
        self.angularModules.push(match[1]);
        match = angularModuleRegex.exec(file);
    }
    return this;
};

angular_manager.prototype.getAngularRoutes = function getAngularRoutes(callback) {
    var self = this;
    $dbi.schema('angular_route').find({}, function(err, routes) {
        var routes = {
            angular : {
                routes : routes,
            }
        };
        $cache.set(routes);
        callback();
    });
};

angular_manager.prototype.getAngularConstants = function getAngularConstants(callback) {
    var self = this;
    $dbi.schema('angular_constant').findDistinct('group', function(err, groups) {
        var count = 0;
        _.each(groups, function(group) {
            $dbi.schema('angular_constant').find({
                group : group
            }, function(err, constants) {
                var constantGroup = {
                    angular : {
                        constants : {},
                    }
                };
                constantGroup.angular.constants[group] = constants;
                $cache.set(constantGroup);
                count++;
                if (count === groups.length) {
                    callback();
                }
            });
        });
    });
};

module.exports = angular_manager;
