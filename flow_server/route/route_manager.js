function route_manager() {
    var bodyParser = require('body-parser');
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
        if (req.session.role === 'admin') {
            var response = _.template($server.asset_manager.get('./flow_client/plugins/admin/views/adminIndex.html').contents);
        } else {
            var response = _.template($server.asset_manager.get('./flow_client/plugins/system/views/index.html').contents);
        }
        res.end(response());
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

route_manager.prototype.getAPIRoutes = function() {
    var self = this;
    var apiFiles = $server.asset_manager.getAPIFiles();
    _.each(apiFiles, function(file) {
        self.apiRoutes['/api/' + file.fileName.slice(0, file.fileName.length - 3) + '/:method'] = function(request, response, next) {
            var apiFile = $server.asset_manager.get(file.filePath);
            var api = new apiFile.func(response, next);
            api[request.params.method](request.body);
        };
    });
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
    self.getAPIRoutes();

    var settings = {
        cookie_secret : 'killthecat',
        db : 'test'
    };
    var session = require('express-session');
    var MongoStore = require('connect-mongo')(session);
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;

    $server.expressapp.use(require('body-parser')());
    $server.expressapp.use(session({
        secret : settings.cookie_secret,
        store : new MongoStore({
            db : settings.db,
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
        $dbi('user').findOne({
            username : username
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    message : 'Incorrect username.'
                });
            }
            // if (!user.validPassword(password)) {
            // return done(null, false, {
            // message : 'Incorrect password.'
            // });
            // }
            return done(null, user);
        });
    }));

    $server.expressapp.post('/auth/login', passport.authenticate('local'), function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        req.session.role = 'admin';
        var data = {
            userId : req.user.username,
            userRole : 'admin',
            sessionId : req.headers.cookie
        };
        res.json(data);
    });

    $server.expressapp.post('/auth/logout', function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
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
        $server.expressapp.use('/' + dir, express.static(process.env.PWD + '/' + dir));
    });

    // Setup get requests for all text based content
    _.each(self.routes, function(route, routePath) {
        $server.expressapp.get(routePath, route);
    });

    // Initiate API routes
    $server.expressapp.use('/api', function(request, response, next) {
        response.message = {
            error : true,
            errorMessage : 'ERROR: API call /api' + request.path + ' not found.',
            data : {}
        };
        response.respond = function() {
            this.writeHead(200, {
                'content-type' : 'application/json'
            });
            this.end(")]}',\n" + JSON.stringify(this.message));
        };
        next();
    });

    // Give API Routes access to the function being called.
    _.each(self.apiRoutes, function(route, routePath) {
        $server.expressapp.post(routePath, route);
    });

    // Finish out API requests, removing the error if not needed.
    $server.expressapp.use('/api', function(request, response, next) {
        if (!response.headerSent) {
            if (!response.message.error) {
                delete response.message.errorMessage;
            }
            response.respond();
        }
    });

    return this;
};

module.exports = route_manager;
