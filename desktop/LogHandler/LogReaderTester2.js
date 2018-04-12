/////////////////////////////////
/////////// Testing  ////////////

var LogReader = require('./LogReader.js');

var report;
var friendlyDecklist;
var opponentDecklist

LogReader.getLogFile();

LogReader.manualLogLocation();

LogReader.beginReporting();

var interval = setInterval(function() {
    var bool = LogReader.report();
    if (bool) {

        friendlyDecklist = LogReader.reportFriendlyDecklist();
        opponentDecklist = LogReader.reportOpponentDecklist();

        console.log("Friendly Decklist");
        for (var i in friendlyDecklist) {
            console.log(friendlyDecklist[i]);
        }

        console.log("Opponent Decklist");
        for (var i in opponentDecklist) {
            console.log(opponentDecklist[i]);
        }
        clearInterval(interval);
        LogReader.beginReporting();
    }
}, 5000);

var interval = setInterval(function() {
    var bool = LogReader.report();
    if (bool) {

        friendlyDecklist = LogReader.reportFriendlyDecklist();
        opponentDecklist = LogReader.reportOpponentDecklist();

        console.log("Friendly Decklist");
        for (var i in friendlyDecklist) {
            console.log(friendlyDecklist[i]);
        }

        console.log("Opponent Decklist");
        for (var i in opponentDecklist) {
            console.log(opponentDecklist[i]);
        }
        clearInterval(interval);
    }
}, 5000);