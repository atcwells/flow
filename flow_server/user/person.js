function _person(_id) {
    this._id = _id;
    return this;
};

_person.prototype = {
    constructor : _person,
    properties : {
        persist : true,
        client : true,
        name : "",
        fields : {
            __v : "0.0.0",
            name : {
                type : "string"
            },
            email : {
                type : 'email'
            }
        }
    },
    shout : function shout() {
        this._log.info('SHOUT ' + this._id + '!');
    },
    getProperties : function getProperties() {
    	return this.properties;
    }
};

module.exports = _person;
