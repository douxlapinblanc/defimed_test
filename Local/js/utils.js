define([], function() {
    'use strict';

    var generalLog = '****************************************\n';

    function getGeneralLog() {
        return generalLog;
    }
function addGeneralLog(text) {
	generalLog = generalLog + text + "\n";
}


    function time() {
        var dt = new Date();
        var hrs = dt.getHours();
        var min = dt.getMinutes();
        var sec = dt.getSeconds();
        var tm = hrs + "h" + min + " et " + sec + " secs ";
        return tm;
    }


    return {
        time: time,
        addGeneralLog: addGeneralLog,
        getGeneralLog: getGeneralLog
    }
});