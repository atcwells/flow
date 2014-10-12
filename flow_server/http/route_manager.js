function route_manager() {
    var self = this;
    self.routes = {};
    self.apiRoutes = {};
    self._event.on('asset.added', function(asset) {
        if ($server.expressapp) {
            self.setup();
        }
    });
    self._event.on('asset.removed', function(asset) {
        if ($server.expressapp && $server.expressapp.routes) {
            for (key in $server.expressapp.routes.get) {
                if ($server.expressapp.routes.get[key].path + "" === '/' + asset.fileType + '/' + asset.fileName) {
                    $server.expressapp.routes.get.splice(key, 1);
                    break;
                }
            }
        }
    });
    return this;
}

route_manager.prototype.utilRoutes = function() {
    var self = this;
    self.routes['/'] = function(req, res, next) {
        res.writeHead(200, {
            'content-type' : 'text/html'
        });
        if (req.user && req.user[0].role && req.user[0].role.length != 0) {
            var MongoClient = require('mongodb').MongoClient;
            var BSON = require('mongodb').BSONPure;
            var o_id = new BSON.ObjectID(req.user[0].role);
            MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
                if (err) {
                    var response = _.template($server.asset_manager.get('./flow_client/plugins/system/views/index.html').contents);
                    res.end(response());
                }
                var collection = db.collection('roles');
                collection.find({
                    _id : o_id
                }).toArray(function(err, role) {
                    db.close();
                    if (!role || role.length == 0) {
                        var response = _.template($server.asset_manager.get('./flow_client/plugins/system/views/index.html').contents);
                        res.end(response());
                    } else if (role[0].name === 'admin') {
                        var response = _.template($server.asset_manager.get('./flow_client/plugins/admin/views/adminIndex.html').contents);
                        res.end(response());
                    } else {
                        var response = _.template($server.asset_manager.get('./flow_client/plugins/system/views/index.html').contents);
                        res.end(response());
                    }
                });
            });
        } else {
            var response = _.template($server.asset_manager.get('./flow_client/plugins/system/views/index.html').contents);
            res.end(response());
        }
    };

    return this;
};

route_manager.prototype.staticAssetRoutes = function() {
    var self = this;
    ['view', 'javascript', 'style'].forEach(function(assetGroup) {
        var assets = $server.asset_manager.getAssetGroup(assetGroup);
        _.each(assets, function(asset) {
            self.routes['/' + assetGroup + '/' + asset.fileName] = function(req, res) {
                res.contentType(asset.fileName);
                res.writeHead(200);
                var response = _.template($server.asset_manager.get(asset.filePath).contents);
                res.end(response());
            };
        });
    });

    self.routes['/javascript/_validators.js'] = function(req, res) {
        res.writeHead(200, {
            'content-type' : 'application/javascript'
        });
        res.end('var _validators = (function(){\n' + $server.asset_manager.get('./flow_server/database_schema/_validators.js').contents + '})();');
    };

    return this;
};

route_manager.prototype.setup = function() {
    var self = this;
    self.utilRoutes();
    self.staticAssetRoutes();

    var session = require('express-session');
    var MongoStore = require('connect-mongostore')(session);

    $server.expressapp.use(session({
      secret : $cache.get('instance_config.cookie_secret'),
      saveUninitialized: true,
      resave: true,
      store : new MongoStore({
          db : $cache.get('database_config.name'),
      })
    }));

    // Bower dependencies will end here with a response.
    ['bower_components', 'flow_readme'].forEach(function(dir) {
        $server.expressapp.use('/' + dir, require('express').static(process.env.PWD + '/' + dir));
    });

    // Setup get requests for all text based content
    _.each(self.routes, function(route, routePath) {
        $server.expressapp.get(routePath, route);
    });

  var RAM = require('responsive-route-manager');

  $server.auth_router = new RAM({
    mongoUri : $cache.get('database_config.uri'),
    userTable : 'users',
    clientType : 'passport-auth',
    mountPath : 'auth',
    logger : self._log
  }, $server.expressapp, function() {

  });

	$server.api_router = new RAM({
		folder : $cache.get('instance_config.api_directory'),
    clientType : 'functional-api',
    mountPath : 'api',
    logger : self._log
	}, $server.expressapp, function(){});

    return this;
};

module.exports = route_manager;
