const path = require('path');
const {app, BrowserWindow} = require('electron');
const electron = require('electron');

// window for logging users in
var main_win;

// window launchs once app is ready
app.whenReady().then(() => {
    main_win = new BrowserWindow({
        width: 1600,
        height: 900,
        
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        }
    })
    console.log(__dirname);
    main_win.loadFile(path.join(__dirname, "src", "index.html"));

    main_win.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      electron.shell.openExternal(url);
  });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

var acc_username;

electron.ipcMain.on("login_event", (event, acc_info) => {
  var result = "fail";
  // TODO replace with DB call to see if username exists
  if(acc_info.username != "") {
    // TODO replace with DB call to see if passwords match
    if(acc_info.password != "")  {
        result = "success"
    }
  }
  main_win.webContents.send("login_return", result, acc_info.username);
  acc_username = acc_info.username;
})