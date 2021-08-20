const { app, BrowserWindow } = require("electron");
const {ipcMain} = require('electron')
let path = require("path");
const os = require('os');

let mainWindow;


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity:false
  
    },
  });

  let url = path.join(__dirname, "index.html");
  mainWindow.loadURL(url);
  mainWindow.setMenuBarVisibility(false);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

//main process
ipcMain.on("getOsInfo",(event,args)=>{
  let osData = os.cpus();
  event.sender.send('replyOsData',osData);
});

ipcMain.on("getOsArch",(event,args) =>{
  let osData = os.arch();
  event.sender.send('replyOsArch',osData);

});

ipcMain.on("getNetworkInterface",(event,args) =>{
  let osData = os.networkInterfaces();
  event.sender.send('replyNetworkInterface',osData);

});







