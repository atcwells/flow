return new Object({
    email : function(value) {
        return false;
    },
    string : function(value) {
		return true;
    },
    objectid : function(value) {
		return true;
    }
});
