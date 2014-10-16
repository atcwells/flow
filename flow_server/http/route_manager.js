function route_manager() {
  var self = this;
  self.routes = {};
  self.apiRoutes = {};
  return this;
}

route_manager.prototype.utilRoutes = function() {
  var self = this;
  self.routes['/'] = function(req, res, next) {
    res.writeHead(200, {
        'content-type' : 'text/html'
    });

    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user[0] && req.session.passport.user[0].role && req.session.passport.user[0].role.length != 0) {
      $dbi.schema('user').find({
        _id : req.session.passport.user[0]._id.toString()
      }, function(err, data) {
        $dbi.schema('role').find({
          _id : data[0].role
        }, function(err, role) {
          if (!role || role.length == 0) {
            var response = _.template($server.asset_manager.get('./flow_server/_client/plugins/system/views/index.html').contents);
            res.end(response());
          } else if (role[0].name === 'admin') {
            var response = _.template($server.asset_manager.get('./flow_server/_client/plugins/admin/views/adminIndex.html').contents);
            res.end(response());
          } else {
            var response = _.template($server.asset_manager.get('./flow_server/_client/plugins/system/views/index.html').contents);
            res.end(response());
          }
        })
      });
    } else {
      var response = _.template($server.asset_manager.get('./flow_server/_client/plugins/system/views/index.html').contents);
      res.end(response());
    }
  };
};

route_manager.prototype.staticAssetRoutes = function() {
  self.routes['/javascript/_validators.js'] = function(req, res) {
    res.writeHead(200, {
      'content-type' : 'application/javascript'
    });
    res.end('var _validators = (function(){\n' + $server.asset_manager.get('./flow_server/_schema/_validators.js').contents + '})();');
  };
};

route_manager.prototype.setup = function(callback) {
  var self = this;
  self.utilRoutes();
  self.staticAssetRoutes();

  var RAM = require('responsive-route-manager');
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
  $server.expressapp.use('/bower_components', require('express').static(shell.pwd() + '/bower_components'));

  // Setup get requests for all text based content
  _.each(self.routes, function(route, routePath) {
      $server.expressapp.get(routePath, route);
  });

  $server.auth_router = new RAM({
    userTable : 'users',
    watchFiles : true,
    folder : '/flow_server/_plugins/readme/views/',
    clientType : 'static',
    mountPath : 'readme',
    logger : new $logger('Readme Router')
  }, $server.expressapp, function(err, msg) {

    $server.auth_router = new RAM({
      mongoUri : $cache.get('database_config.uri'),
      userTable : 'users',
      watchFiles : true,
      clientType : 'passport-auth',
      mountPath : 'auth',
      logger : new $logger('Auth Router')
    }, $server.expressapp, function(err, msg) {
      callback(null, '');
      // $server.api_router = new RAM({
      //   folder : $cache.get('instance_config.api_directory'),
      //   watchFiles : true,
      //   clientType : 'functional-api',
      //   mountPath : 'api',
      //   logger : new $logger('API Router')
      // }, $server.expressapp, function(err, msg){
      //   callback(null, '');
      // });
    });
  });
};

module.exports = route_manager;
