(function() {"use strict";

    var winston = require('winston');
    winston.loggers.add('_log', {
        console : {
            level : 'info',
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
        	// process.stdout.write(DateHelper.constructLogsDate());
            _logger.info(DateHelper.constructLogsDate() + message);
        };

        this.debug = function(message) {
            _logger.transports.console.label = label;
        	// process.stdout.write(DateHelper.constructLogsDate());
            _logger.debug(DateHelper.constructLogsDate() + message);
        };

        this.error = function(message) {
            _logger.transports.console.label = label;
        	// process.stdout.write(DateHelper.constructLogsDate());
            _logger.error(DateHelper.constructLogsDate() + message);
            var stack = new Error().stack;
            console.log(stack + '\n');
        };

        this.profile = function(message) {
            _logger.transports.console.label = label;
        	// process.stdout.write(DateHelper.constructLogsDate());
            _logger.profile(DateHelper.constructLogsDate() + message);
        };

        this.warn = function(message) {
            _logger.transports.console.label = label;
        	// process.stdout.write(DateHelper.constructLogsDate());
            _logger.warn(DateHelper.constructLogsDate() + message);
        };
    };

    module.exports = LoggerInterface;
})();
