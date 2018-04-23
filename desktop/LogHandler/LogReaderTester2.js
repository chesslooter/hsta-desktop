/////////////////////////////////
/////////// Testing  ////////////

var LogReader = require('./LogReader.js');

var report;
var friendlyDecklist;
var opponentDecklist;

var game1Complete = false;
var game2Complete = false;
var game3Complete = false;

LogReader.getLogFile();

LogReader.manualLogLocation();

function gameOne() {
    LogReader.beginReporting();

    var interval = setInterval(function() {
        var bool = LogReader.report();
        if (bool) {

            friendlyDecklist = LogReader.reportFriendlyDecklist();
            opponentDecklist = LogReader.reportOpponentDecklist();
            var p1 = LogReader.reportPlayerOne();
            var p2 = LogReader.reportPlayerTwo();

            console.log("Friendly Decklist");
            for (var i in friendlyDecklist) {
                console.log(friendlyDecklist[i]);
            }

            console.log("Opponent Decklist");
            for (var i in opponentDecklist) {
                console.log(opponentDecklist[i]);
            }

            console.log("Player 1")
            console.log(p1);
            console.log("Player 2")
            console.log(p2);

            clearInterval(interval);

            game1Complete = true;

        }
    }, 5000);

}

function gameTwo() {

    if (game1Complete) {

        LogReader.beginReporting();
        var interval = setInterval(function() {
            var bool = LogReader.report();
            if (bool) {

                friendlyDecklist = LogReader.reportFriendlyDecklist();
                opponentDecklist = LogReader.reportOpponentDecklist();
                var p1 = LogReader.reportPlayerOne();
                var p2 = LogReader.reportPlayerTwo();

                console.log("Friendly Decklist");
                for (var i in friendlyDecklist) {
                    console.log(friendlyDecklist[i]);
                }

                console.log("Opponent Decklist");
                for (var i in opponentDecklist) {
                    console.log(opponentDecklist[i]);
                }

                console.log("Player 1")
                console.log(p1);
                console.log("Player 2")
                console.log(p2);

                clearInterval(interval);
                game2Complete = true;
            }
        }, 5000);

    } else {
        setTimeout(function() { gameTwo() }, 1000);
    }
}

function gameThree() {

    if (game2Complete) {

        LogReader.beginReporting();
        var interval = setInterval(function() {
            var bool = LogReader.report();
            if (bool) {

                friendlyDecklist = LogReader.reportFriendlyDecklist();
                opponentDecklist = LogReader.reportOpponentDecklist();
                var p1 = LogReader.reportPlayerOne();
                var p2 = LogReader.reportPlayerTwo();

                console.log("Friendly Decklist");
                for (var i in friendlyDecklist) {
                    console.log(friendlyDecklist[i]);
                }

                console.log("Opponent Decklist");
                for (var i in opponentDecklist) {
                    console.log(opponentDecklist[i]);
                }

                console.log("Player 1")
                console.log(p1);
                console.log("Player 2")
                console.log(p2);

                clearInterval(interval);
                game3Complete = true;
            }
        }, 5000);

    } else {
        setTimeout(function() { gameThree() }, 1000);
    }

}

function testComplete() {
    if (game3Complete) {
        console.log("Test Complete");
    } else {
        setTimeout(function() { testComplete() }, 1000);
    }
}

/*
// Testing function call
*/
gameOne();
gameTwo();
gameThree();
testComplete();