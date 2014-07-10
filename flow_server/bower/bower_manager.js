function bower_manager() {
    this.bowerDependencies = [];
    this.styleDependencies = [];
    this.scriptDependencies = [];
    return this;
}

bower_manager.prototype.readBowerJson = function readBowerJson() {
    var self = this;
    self.bowerFile = new $dir.json_file('./bower.json').readFile().contents;
    _.each(this.bowerFile.dependencies, function(dependency, depName) {
        self.bowerDependencies.push(depName);
    });
    $cache.set({
        bower : {
            dependencies : self.bowerDependencies,
        }
    });
    return this;
};

bower_manager.prototype.getDependencyFiles = function getDependencyFiles() {
    var self = this;
    this.bowerDependencies.forEach(function(dependency) {
        self.getFilesForDependency(dependency);
    });

    $cache.set({
        bower : {
            style_dependencies : self.styleDependencies,
            script_dependencies : self.scriptDependencies,
        }
    });
    return this;
};

bower_manager.prototype.getFilesForDependency = function getFilesForDependency(dependencyName) {
    var self = this;
    var dependencyBowerFile = new $dir.json_file('./bower_components/' + dependencyName + '/bower.json').readFile();
    if (dependencyBowerFile.contents) {
        var dependencies = dependencyBowerFile.contents.main;
        if (!_.isArray(dependencies)) {
            dependencies = [dependencies];
        }
        dependencies.forEach(function(dependency) {
            dependency = _(dependency).stripLeadingDot();
            dependency = _(dependency).addLeadingSlash();
            if (dependency.value().indexOf('.css') == dependency.value().length - 4) {
                self.styleDependencies.push('/bower_components/' + dependencyName + dependency.value());
            } else if (dependency.value().indexOf('.js') == dependency.value().length - 3) {
                self.scriptDependencies.push('/bower_components/' + dependencyName + dependency.value());
            }
        });
    }
    self._event.emit('file.unmount', dependencyBowerFile);
};

bower_manager.prototype.installPackage = function installPackage(package, callback) {
    $server.childProcessCommand("bower install --save " + package, callback);
};

bower_manager.prototype.uninstallPackage = function uninstallPackage(package, callback) {
    $server.childProcessCommand("bower uninstall --save " + package, callback);
};

module.exports = bower_manager;
