return new Object({
    objectid : function(value) {
        if (value === "") {
            return null;
        } else {
			return value;
        }
    },
    string : function(value) {
        return value;
    }
});
