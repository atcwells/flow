_.mixin({
    'stripLeadingDot' : function stripLeadingDot(string) {
        if (string.indexOf('.') === 0) {
            string = string.slice(1);
        }
        return string;
    }
});

_.mixin({
    'stripLeadingSlash' : function stripLeadingSlash(string) {
        if (string.indexOf('/') === 0) {
            string = string.slice(1);
        }
        return string;
    }
});

_.mixin({
    'stripTrailingSlash' : function stripLeadingSlash(string) {
        if (string.indexOf('/') === string.length) {
            string = string.slice(0, string.length - 1);
        }
        return string;
    }
});

_.mixin({
    'addLeadingDot' : function addLeadingSlash(string) {
        if (string.indexOf('.') !== 0) {
            string = '.' + string;
        }
        return string;
    }
});

_.mixin({
    'addLeadingSlash' : function addLeadingSlash(string) {
        if (string.indexOf('/') !== 0) {
            string = '/' + string;
        }
        return string;
    }
});

_.mixin({
    'getFileType' : function getFileType(filename) {
        var filetype = require('path').extname(filename).toLowerCase();
        switch (filetype) {
            case '.woff':
            case '.eot':
            case '.ttf':
            case '.svg':
                return 'font';
            case '.json':
                return 'json';
            case '.js':
                return 'javascript';
            case '.css':
                return 'style';
            case '.jpg':
            case '.jpeg':
            case '.png':
            case '.tiff':
            case '.gif':
                return 'image';
            case '.html':
                return 'view';
        }
        return undefined;
    }
});
