module.exports = function cache(request, response, callback) {
    var self = this;
    self.user = (request && request.user[0]) || {};
    self.request = request;
    self.response = response;
    self.callback = callback;

	self.properties = {
		responseMechanism: 'sendJSON',
		name: 'cache',
		verb: 'post'
	};
	
    self.read = function read(params) {
        self.response.message.error = false;
        self.response.message.data.cacheObjects = $cache.getAll();
        self.callback(response);
    };

	return self;
};
