return new Object({
    objectid : function(value) {
    	console.log('_getter:objectid:' + value);
        return value;
    },
    string : function(value) {
    	console.log('_getter:string:' + value);
		return value;
    }
});
