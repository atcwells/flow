function asset_manager() {
    var self = this;
    self.assetLibrary = {};
    $event.on('file.written', function(data) {
        self.addAsset(data);
    });
    $event.on('file.read', function(data) {
        self.addAsset(data);
    });
    $event.on('file.unmount', function(data) {
        self.unmountAsset(data);
    });
    $event.on('file.copied', function(data) {
        self.addAsset(data);
    });
    $event.on('file.moved', function(data) {
        self.removeAsset(data);
        self.addAsset(data);
    });
    $event.on('file.deleted', function(data) {
        self.removeAsset(data);
    });
    return self;
};

asset_manager.prototype = {
    constructor : asset_manager,
    addAsset : function addAsset(assetObject) {
        var fileType = _(assetObject.filePath).getFileType();
        if (!this.assetLibrary[fileType]) {
            this.assetLibrary[fileType] = {};
        }
        this.assetLibrary[fileType][assetObject.filePath] = assetObject;
        $event.emit('asset.added', assetObject);
        return this;
    },
    unmountAsset : function unmountAsset(assetObject) {
        var fileType = _(assetObject.filePath).getFileType();
        if (this.assetLibrary[fileType] && this.assetLibrary[fileType][assetObject.filePath]) {
            this.assetLibrary[fileType][assetObject.filePath] = false;
        }
        assetObject.fileType = fileType;
        $event.emit('asset.removed', assetObject);
        return this;
    },
    removeAsset : function removeAsset(fileName) {
        var fileType = _(fileName).getFileType();
        if (this.assetLibrary[fileType] && this.assetLibrary[fileType][fileName]) {
            delete this.assetLibrary[fileType][fileName];
        }
        return this;
    },
    get : function get(filename) {
        var self = this;
        var asset = {};
        _.each(self.assetLibrary, function(type, typeName) {
            if (type[filename]) {
                asset = type[filename];
                return false;
            }
        });
        if (!_.isEmpty(asset)) {
            return asset;
        } else {
            return undefined;
        }
    },
    getAssetGroup : function(groupName) {
        if (this.assetLibrary[groupName]) {
            return this.assetLibrary[groupName];
        }
        return undefined;
    },
    getDirectives : function() {
        var jsFiles = this.getAssetGroup('javascript');
        var directives = [];
        _.each(jsFiles, function(file) {
            if (file && file.fileName && file.fileName.indexOf('directive') > -1) {
                directives.push(_(file.fileName).stripLeadingDot().value());
            }
        });
        return directives;
    },
    getControllers : function() {
        var jsFiles = this.getAssetGroup('javascript');
        var directives = [];
        _.each(jsFiles, function(file) {
            if (file && file.fileName && file.fileName.indexOf('controller') > -1) {
                directives.push(_(file.fileName).stripLeadingDot().value());
            }
        });
        return directives;
    },
    getControllerForView : function(view) {
    	var controllerPath = view.filePath.replace('views', 'controllers');
    	controllerPath = controllerPath.slice(0, controllerPath.length - view.fileName.length);
    	var controllerName = 'controller_' + view.fileName;
    	controllerName = controllerName.slice(0, controllerName.length - 5);
    	controllerName = controllerName + '.js';
    	return this.get(controllerPath + controllerName);

    },
    getServices : function() {
        var jsFiles = this.getAssetGroup('javascript');
        var directives = [];
        _.each(jsFiles, function(file) {
            if (file && file.fileName && file.fileName.indexOf('service') > -1) {
                directives.push(_(file.fileName).stripLeadingDot().value());
            }
        });
        return directives;
    },
    getAPIFiles : function() {
        var jsFiles = this.getAssetGroup('javascript');
        var apiDirectory = $cache.get('instance_config.api_directory');
        var apiFiles = [];
        _.each(jsFiles, function(file) {
            if (file && file.fileName && file.filePath.indexOf(apiDirectory > -1)) {
                apiFiles.push(file);
            }
        });
        return apiFiles;
    },
};

module.exports = asset_manager;
