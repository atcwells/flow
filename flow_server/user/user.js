function user(_id) {
	this._id = _id;
    return this;
};

user.prototype = {
    constructor : user,
    properties : {
        inherits : "person",
        fields : {
            __v : "0",
            name : {
                type : "string"
            },
            email : {
                type : 'email'
            }
        }
    },
    shout : function shout() {
        this._log.error('SHOUT ' + this._id + '!!!!!');
    }
};

module.exports = user;
