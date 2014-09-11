(function() {"use strict";

    var winston = require('winston');
    winston.loggers.add('_log', {
        console : {
            level : 'debug',
            colorize : 'true',
        }
    });
    winston.addColors({
        info : 'cyan',
        debug : 'green',
        warn : 'yellow',
        error : 'red',
        undefined : 'red',
    });

    var _logger = winston.loggers.get('_log');

    function LoggerInterface(label) {
        var label = label;
        var DateHelper = new $dir.date_helper();

        this.info = function(message) {
            _logger.transports.console.label = label;
        	process.stdout.write(DateHelper.constructLogsDate());
            _logger.info(message);
        };

        this.debug = function(message) {
            _logger.transports.console.label = label;
        	process.stdout.write(DateHelper.constructLogsDate());
            _logger.debug(message);
        };

        this.error = function(message) {
            _logger.transports.console.label = label;
        	process.stdout.write(DateHelper.constructLogsDate());
            _logger.error(message);
            var stack = new Error().stack;
            console.log(stack + '\n');
        };

        this.profile = function(message) {
            _logger.transports.console.label = label;
        	process.stdout.write(DateHelper.constructLogsDate());
            _logger.profile(message);
        };

        this.warn = function(message) {
            _logger.transports.console.label = label;
        	process.stdout.write(DateHelper.constructLogsDate());
            _logger.warn(message);
        };
    };

    module.exports = LoggerInterface;
})();
