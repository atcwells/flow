return new Object({
    objectid : function(value) {
    	console.log('_setter:objectid:' + value);
        if (value === "") {
            return null;
        } else {
			return value;
        }
    },
    string : function(value) {
    	console.log('_setter:string:' + value);
    	return value;
    }
});
