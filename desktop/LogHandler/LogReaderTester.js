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
    }
}, 5000);



/*
// Functionality is currently unsupported
// To solve log.config errors download another 
// hs deck tracker that will correctly configure 
// the files
*/
// LogReader.logReader();
// LogReader.getLogFile();
// LogReader.setLogFile();
// LogReader.printLogLocations();