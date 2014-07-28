return function cache(response, user, callback) {
    var self = this;
    self.response = response;
    self.callback = callback;

    self.read = function(params) {
        self.response.message.error = false;
        self.response.message.data.cacheObjects = $cache.getAll();
        self.callback();
    };

	return self;
};
