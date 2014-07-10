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

    function writeDate() {
        process.stdout.write(this.DateHelper.constructLogsDate());
    }

    function LoggerInterface(label) {
        this.label = label;
        this.writeDate = writeDate;
        this.DateHelper = new $dir.date_helper();

        this.info = function(message) {
            _logger.transports.console.label = label;
            this.writeDate();
            _logger.info(message);
        };

        this.debug = function(message) {
            _logger.transports.console.label = label;
            this.writeDate();
            _logger.debug(message);
        };

        this.error = function(message) {
            _logger.transports.console.label = label;
            this.writeDate();
            _logger.error(message);
            var stack = new Error().stack;
            console.log(stack + '\n');
        };

        this.profile = function(message) {
            _logger.transports.console.label = label;
            this.writeDate();
            _logger.profile(message);
        };

        this.warn = function(message) {
            _logger.transports.console.label = label;
            this.writeDate();
            _logger.warn(message);
        };
    };

    module.exports = LoggerInterface;
})();
