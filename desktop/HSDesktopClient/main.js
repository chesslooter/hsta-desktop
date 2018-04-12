const { app, BrowserWindow, ipcMain, Tray, Shell, Menu } = require('electron');
const path = require('path');
const electron = require('electron');
const platform = require('os').platform();

//Log Reader
const LogReader = require('../LogHandler/LogReader.js');
var report;
var friendlyDecklist;
var opponentDecklist
var runOnce = false;


const assetsDirectory = path.join(__dirname, 'src/assets');

let tray = undefined;
let mainWindow = undefined;
let shell = undefined;
let template = undefined;
let menu = undefined;

let appTitle = `HSDeckTracker`;

// Don't show the app in the doc
if (app && app.dock) {
  app.dock.hide();
}

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

const createTray = () => {
  tray = new Tray(path.join(assetsDirectory, 'icon.png'));
  tray.on('right-click', toggleWindow);
  tray.on('double-click', toggleWindow);
  tray.on('click', function (event) {
    toggleWindow();

  });
};

const getWindowPosition = () => {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round((windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height - 500);

  return { x: x, y: y };
};

const createWindow = () => {
  console.log("creating window");
  mainWindow = new BrowserWindow({
    width: 520, //window width should be 520
    height: 440, //window height should be 440
    show: true,
    frame: true,
    fullscreenable: true,
    alwaysOnTop: false,
    resizable: true, //turn off to lock size 
    transparent: false,
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
      webSecurity: false
    },
    icon: __dirname + 'assets/icon.png',
    backgroundColor: '#555555',
  });
  mainWindow.loadURL(`file://${__dirname}/dist/index.html`);
  // mainWindow.webContents.openDevTools();

  mainWindow.on('click', () => {
    mainWindow.hide();
  });

  // Hide the window when it loses focus
  //mainWindow.on('blur', () => {
  //if (!mainWindow.webContents.isDevToolsOpened()) {
  //mainWindow.hide();
  //}
  //});

};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  const position = getWindowPosition();
  mainWindow.setPosition(position.x, position.y, false);
  mainWindow.show();
  mainWindow.focus();

};

ipcMain.on('show-window', () => {
  showWindow();
});

ipcMain.on('hide-window', () => {
  mainWindow.hide();
});

ipcMain.on('reload-window', () => {
  mainWindow.loadURL(`file://${path.join(__dirname, 'index.html')}`);
});

ipcMain.on('kill', () => {
  app.quit();
});

ipcMain.on('startValidation', function (event, arg) {
  if(!runOnce){
    LogReader.getLogFile();
    LogReader.manualLogLocation();
    runOnce = true;
  }
  LogReader.beginReporting();

  var interval = setInterval(function () {
    var bool = LogReader.report();
    if (bool) {

      friendlyDecklist = LogReader.reportFriendlyDecklist();
      opponentDecklist = LogReader.reportOpponentDecklist();

      event.sender.send('logF', friendlyDecklist);
      event.sender.send('logO', opponentDecklist);

      clearInterval(interval);
    }
  }, 5000);
});




app.on('ready', () => {
  console.log('ready: ');
  createTray();
  console.log('createTray() done');
  createWindow();
  console.log('createWindow() done');
  electron.powerMonitor.on('resume', () => {
    console.log('first step');
  });
});