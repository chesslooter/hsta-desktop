var path = require('path');
var os = require('os');
var fs = require('fs');

var Farseer = require('farseer').default;
var farseer = new Farseer();

/*
// Creating Module
*/
var exports = module.exports = {};

/*
// Variables
*/
// Location of the logFile output while Hearthstone is being played
var logFile = "";
// Location the config file needs to be placed to receive log output
var configFileLoc = "";
// Name of the file that configures the Hearthstone log output
var configFileName = "log.config";
// Tells the program the decklist is ready to be called
var reportDecklist = false;
// The game is started, dont add to decklist
var gameStarted = false;

// Decklist Object 
function Decklist() {

    this.decklist = [];

    this.add = function(data) {

        var push = true;
        for (var i = 0; i < this.decklist.length; i++) {
            if (this.decklist[i].cardId == data.cardId) {
                this.decklist[i].count += 1;
                push = false;
            }
        }

        if (push) {
            this.decklist.push({
                cardId: data.cardId,
                entityId: data.entityId,
                count: 1
            });
        }

    }



    // Removes the cards generated during the game from the final decklist
    this.removeFalsePositives = function(deckEntityIds) {
        for (var i = 0; i < this.decklist.length; i++) {

            var removeCard = true;
            for (var j = 0; j < deckEntityIds.length; j++) {

                // Doesn't remove card from deck if it was in the original entities
                if (deckEntityIds[j] === this.decklist[i].entityId) {
                    removeCard = false;
                }
            }

            if (removeCard) {
                console.log("REMOVED CARD");
                if (this.decklist[i].count == 1) {
                    delete this.decklist[i];
                } else {
                    this.decklist[i].count -= 1;
                }
            }

        }
    }

}

/*
// DECKLISTS
*/
// Friendly's Decklsit
var friendlyDecklist = new Decklist();
// Friendly Remove Decklist
var friendlyEntityList = [];
// Opponent's decklist
var opponentDecklist = new Decklist();
// Opponent Remove Decklist
var opponentEntityList = [];

/*
// Searches for new entries in the logFile specified to determine whether 
// the log has changed and needs handling. These differences are 
// handled line by line and passed to the  handleChange function to parse the data.
// Polling begins by calling beginReporting().
*/
farseer.on('zone-change', function(data) {
    // console.log(data);
    // console.log(data.cardId + ' has moved from ' + data.fromTeam + ' ' + data.fromZone + ' to ' + data.toTeam + ' ' + data.toZone + ' card name ' + data.cardName + ' entity id ' + data.entityId);
    handleChange(data);
});

farseer.on('game-start', function(data) {
    console.log("Game Start");
    // friendlyDecklist = new Decklist();
    // friendlyEntityList = [];
    // opponentDecklist = new Decklist();
    // opponentEntityList = [];
});

farseer.on('game-over', function(data) {
    console.log("Game End");

    // console.log(friendlyDecklist);
    // console.log(opponentDecklist);

    // console.log("Friendly Remove");
    // console.log(friendlyEntityList);
    // console.log("Opponent Remove");
    // console.log(opponentEntityList);

    friendlyDecklist.removeFalsePositives(friendlyEntityList);
    opponentDecklist.removeFalsePositives(opponentEntityList);

    // // Final Friendly Decklist
    // console.log("Final Friendly Decklist");
    // console.log(friendlyDecklist);
    // // Final Opponent Decklist
    // console.log("Final Opponent Decklist");
    // console.log(opponentDecklist);

    reportDecklist = true;
    stopReporting();
});

/*
// Determines whether the log file change includes a reportable Decklist for reportDecklist(). Searches for keywords 
// in the log file that contains deck information and stores it.
*/
handleChange = function(data) {

    // Friendly Deck Tracking
    if (data.fromTeam == "FRIENDLY" && data.fromZone == "HAND" && data.toTeam == "FRIENDLY" && data.toZone == "PLAY") {
        friendlyDecklist.add(data);
    }
    // Opponent Deck Tracking
    if (data.fromTeam == "OPPOSING" && data.fromZone == "HAND" && data.toTeam == "OPPOSING" && data.toZone == "PLAY") {
        opponentDecklist.add(data);
    }
    // Friendly Deck Tracking
    if (data.toTeam == "FRIENDLY" && data.toZone == "GRAVEYARD" && data.fromZone != "PLAY") {
        for (var i = 0; i < friendlyEntityList.length; i++) {
            if (data.entityId == friendlyEntityList[i]) {
                friendlyDecklist.add(data);
            }
        }
    }
    // Opponent Deck Tracking
    if (data.toTeam == "OPPOSING" && data.toZone == "GRAVEYARD" && data.fromZone != "PLAY") {
        for (var i = 0; i < opponentEntityList.length; i++) {
            if (data.entityId == opponentEntityList[i]) {
                opponentDecklist.add(data);
            }
        }
    }

    // Add EntityIds of cards in friendly deck
    if (data.toTeam == "FRIENDLY" && data.toZone == "DECK") {
        if (!gameStarted) {
            friendlyEntityList.push(data.entityId);
        }
    }
    // Add EntityIds of cards in opponent deck
    if (data.toTeam == "OPPOSING" && data.toZone == "DECK") {
        if (!gameStarted) {
            opponentEntityList.push(data.entityId);
        }
    }
    // Stops the Entity Lists from being added to after the game has started
    if (data.toTeam == "FRIENDLY" && data.toZone == "PLAY (Hero Power)") {
        gameStarted = true;
    }

};

/*
// Check if the module can successfully be called from the tester.
*/
exports.logReader = function() {
    return console.log("Module Successfully Imported");
};

/*
// Calls the pollForChange method which begins the process for handling changes to the log file.
*/
exports.beginReporting = function() {
    farseer.start();
};

/*
// Stops the application from polling the logFile.
*/
stopReporting = function() {
    farseer.stop();
};

/*
// Reports true or false. 
// True = decklist is ready to pull
// False = still collecting data
*/
exports.report = function() {
    return reportDecklist;
}

/*
// Reports a Decklist to ValidationManager
*/
exports.reportFriendlyDecklist = function() {
    return friendlyDecklist.decklist;
};

/*
// Reports a Decklist to ValidationManager
*/
exports.reportOpponentDecklist = function() {
    return opponentDecklist.decklist;
};

/*
// Set test log file location for testing without Hearthstone client
*/
exports.setLogFileLocation = function(logLocation) {
    logFile = logLocation;
}

/*
// Need the config.log file placed to get logs for the game output. 
// This wont be necesary once we get the automatic file placement working 
*/
exports.manualLogLocation = function() {
    console.log("Place the log.config file included in the directory location specified below");
    console.log(configFileLoc);
    console.log("If that doesn't work on your machine, download the OS appropriate application below and run it once")
    console.log("https://hsdecktracker.net/")
}

/*
// Prints the variables stored
*/
exports.printLogLocations = function() {
    console.log("Log Information");
    console.log(logFile);
    console.log(configFileLoc);
    console.log(configFileName);
}

/////////////////////////////////////////////////////////
// Copy file work. Will be saved for Iter2 most likely //
/////////////////////////////////////////////////////////

/*
// Basic file copy method.
// Copies file to dir2.
*/
var copyFile = (file, dir2) => {

    //gets file name and adds it to dir2
    var f = path.basename(file);
    var source = fs.createReadStream(file);
    var dest = fs.createWriteStream(path.resolve(dir2, f));

    source.pipe(dest);
    source.on('end', function() { console.log('Successfully copied'); });
    source.on('error', function(err) { console.log(err); });
};

/*
// To obtain the games actions in a log file, you must add a log.config file that has been provided 
// in the folder to a specific location in the file structure. 
// TODO: Allow it to verify permissions.
*/
exports.setLogFile = function() {
    console.log("Set Log File");

    let filename = configFileName;
    let ourConfigFile = path.join(__dirname, filename);

    // console.log(configFileLoc);
    // console.log(ourConfigFile);

    mkdirp(configFileLoc, function(err) {
        if (err) console.error(err)
        else console.log('Successfully created directory')
    });

    copyFile(ourConfigFile, configFileLoc);
};

// /*
// Updates the logFile field with the most current appropriate Hearthstone log file.
// This method also determines the correct pathing for the location of this log file 
// depending on if you are on a Windows or Mac. 
// */
exports.getLogFile = function() {
    console.log("Get Log File");

    if (/^win/.test(os.platform())) {
        console.log('Windows computer.');
        var programFiles = 'Program Files';
        if (/64/.test(os.arch())) {
            programFiles += ' (x86)';
        }

        // These are default locations, if the user has changed the location of their directory it will fail
        // we can support finding this in the application
        logFile = path.join('C:', programFiles, 'Hearthstone', 'Logs', 'Power.log');
        configFileLoc = path.join(process.env.LOCALAPPDATA, '/Blizzard/Hearthstone/');

    } else {
        console.log('Mac computer.');

        logFile = path.join('/Applications/Hearthstone/Logs/Power.log');
        configFileLoc = path.join(process.env.HOME, '/Library/Preferences/Blizzard/Hearthstone/');

    }

};