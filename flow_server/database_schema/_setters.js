return new Object({
    _objectid : function(value) {
        if (value === "") {
            return null;
        } else {
			return value;
        }
    },
    _string : function(value) {
    	return value;
    }
});
