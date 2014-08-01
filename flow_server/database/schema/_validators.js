return new Object({
    email : function(value) {
        return (/\S+@\S+/).test(value);
    },
    string : function(value) {
		return true;
    },
    objectid : function(value) {
		return true;
    }
});
