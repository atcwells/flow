_ = require('lodash-node');
require(process.env.PWD + '/$utils');
$dir = require(process.env.PWD + '/$dir');
$dir = new $dir(process.env.PWD + '/server');
async = require('async');

user = new $dir.user('alex');

describe('object instantiation', function() {
	var id = 'alex';
    user = new $dir.user(id);
    it('should return an object of type "user"', function() {
        expect(user instanceof $dir.user).toBe(true);
    });
    it('should have an _id of ' + id, function() {
  		expect(user._id).toBe(id);
    });
});
