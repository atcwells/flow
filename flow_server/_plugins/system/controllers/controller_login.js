angular.module('<%= $cache.get("instance_config.name") %>').controller('login', ['Hook', '$location', 'AuthService', '$rootScope', 'CryptoService', 'AUTH_EVENTS', 
function(Hook, $location, AuthService, $rootScope, CryptoService, AUTH_EVENTS) {
    var self = this;

    self.credentials = {
        username : '',
        password : ''
    };

    self.passwordUpdate = function(event) {
        var key;
        if (event.keyCode) {
            key = String.fromCharCode(event.keyCode);
        } else {
            key = String.fromCharCode(event.charCode);
        }
        key = CryptoService.SHA3(self.credentials.password + key);
        self.credentials.password = key.toString(CryptoService.enc.Base64);
    };

    self.login = function() {
        AuthService.login(self.credentials).then(function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function() {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
    };
}]);
