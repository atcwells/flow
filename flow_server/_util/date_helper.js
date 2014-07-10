(function() {

    function dateNormalizer(date, decimal_places) {
        if (parseInt(date) < 10 && decimal_places == 2) {
            return "0" + date;
        } else if (decimal_places === 3 && parseInt(date) < 100 && parseInt(date) >= 10) {
            return "0" + date;
        } else if (decimal_places === 3 && parseInt(date) < 10) {
            return "00" + date;
        } else {
            return date;
        }
    };

    function constructLogsDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = dateNormalizer(date.getUTCMonth() + 1, 2);
        var day = dateNormalizer(date.getDay(), 2);
        var hours = dateNormalizer(date.getHours(), 2);
        var minutes = dateNormalizer(date.getMinutes(), 2);
        var seconds = dateNormalizer(date.getSeconds(), 2);
        var millis = dateNormalizer(date.getMilliseconds(), 3);

        return (year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + ' [' + millis + '] ');
    };
    
    function constructFileDate() {
        var date = new Date();
        var year = date.getFullYear();
        var month = dateNormalizer(date.getUTCMonth() + 1, 2);
        var day = dateNormalizer(date.getDay(), 2);
        var hours = dateNormalizer(date.getHours(), 2);
        var minutes = dateNormalizer(date.getMinutes(), 2);
        var seconds = dateNormalizer(date.getSeconds(), 2);
        var millis = dateNormalizer(date.getMilliseconds(), 3);

        return (year + month + day + '_' + hours + minutes + seconds);
    };

    function DateHelper() {
        this.constructLogsDate = constructLogsDate;
        this.dateNormalizer = dateNormalizer;
        this.constructFileDate = constructFileDate;
    }


    module.exports = DateHelper;
})();
