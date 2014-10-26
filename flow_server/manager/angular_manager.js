var file = require(shell.pwd() + '/flow_server/file/file');

function angular_manager() {
    this.angularModules = [];
    return this;
};

angular_manager.prototype.searchForAngularModules = function searchForAngularModules(files) {
    var self = this;
    _.each(files, function(fileName) {
        if (fileName.indexOf('.js') === (fileName.length - 3)) {
            var fileObj = new file('.' + fileName).readFile().contents;
            var strip = require('strip-comments');
            fileObj = strip(fileObj);
            var angularModuleRegex = /angular.module\([\"\']([a-zA-Z0-9\.\-]*)[\"\']\, ?\[/g;
            var match = angularModuleRegex.exec(fileObj);
            while (match) {
                self.angularModules.push(match[1]);
                match = angularModuleRegex.exec(fileObj);
            }
        }
    });
    $cache.set({
        angular : {
            import_modules : self.angularModules,
        }
    });
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
        var groupsToEvaluate = groups.length;
        if(!groupsToEvaluate) {
          callback(null, "Found no Angular Constant Groups to initiailze");
        }
        _.each(groups, function(group) {
            $dbi.schema('angular_constant').find({
                group : group
            }, function(err, constants) {
              if(err) {
                callback(err, constants);
              }
              var constantGroup = {
                angular : {
                  constants : {},
                }
              };
              constantGroup.angular.constants[group] = constants;
              $cache.set(constantGroup);
              groupsToEvaluate--;
              if (!groupsToEvaluate) {
                callback(null, "");
              }
            });
        });
    });
};

module.exports = angular_manager;
