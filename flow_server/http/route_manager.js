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

    self.routes['/flushCache'] = function(req, res) {
        res.writeHead(200, {
            'content-type' : 'text/html'
        });
        $server.controller.restart();
        res.end('<div>Cache Flushed:</div><br /><ul></ul>');
    };

    self.routes['/viewCache'] = function(req, res) {
        res.writeHead(200, {
            'content-type' : 'application/json'
        });
        res.end(JSON.stringify($cache.getAll()));
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
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    $server.expressapp.use(require('body-parser').json());
    $server.expressapp.use(session({
      secret : $cache.get('instance_config.cookie_secret'),
      saveUninitialized: true,
      resave: true,
      store : new MongoStore({
          db : $cache.get('database_config.name'),
      })
    }));
    $server.expressapp.use(passport.initialize());
    $server.expressapp.use(passport.session());

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
            if (err)
                return done(err);

            var collection = db.collection('users');
            collection.find({
                username : username
            }).toArray(function(err, user) {
                db.close();
                if (!user) {
                    return done(null, false, {
                        message : 'Incorrect username.'
                    });
                }
                if (password !== user[0].password) {
                    return done(null, false, {
                        message : 'Incorrect password.'
                    });
                }
                return done(null, user);
            });
        });
    }));

    $server.expressapp.post('/auth/login', passport.authenticate('local'), function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      var data = {
          userId : req.user.username,
          userRole : req.user.role,
          sessionId : req.headers.cookie
      };
      res.json(data);
    });

    $server.expressapp.post('/auth/logout', function(req, res) {
        req.logout();
        if (req.session.role) {
            delete req.session.role;
        }
        res.writeHead(200, {
            'content-type' : 'application/json'
        });
        res.end("logout success");
    });

    // Initial request path.
    $server.expressapp.use('/', function(req, res, next) {
        next();
    });

    // Bower dependencies will end here with a response.
    ['bower_components', 'flow_readme'].forEach(function(dir) {
        $server.expressapp.use('/' + dir, require('express').static(process.env.PWD + '/' + dir));
    });

    // Setup get requests for all text based content
    _.each(self.routes, function(route, routePath) {
        $server.expressapp.get(routePath, route);
    });

	var RAM = require('responsive-route-manager');
	$server.api_manager = new RAM({
		folder : $cache.get('instance_config.api_directory'),
	    clientType : 'functional-api',
	    mountPath : 'api',
	    logger : self._log
	}, $server.expressapp);

    return this;
};

module.exports = route_manager;
