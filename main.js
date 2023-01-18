const mongoDBapi = require('mongodb-data-api');
const path = require('path');
const {app, BrowserWindow} = require('electron');
const electron = require('electron');

// creating api constant
const api = mongoDBapi.createMongoDBDataAPI({
  apiKey:'<########>',
  appId: '<betbotapplication-yaelz>'
})


/******************** Stuff for launching electron *********************/

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

/******************** Login Event ********************/

electron.ipcMain.on("login_event", (event, acc_info) => {
  var result = "fail";

  var queryResult;

  await api.findOne( {
    dataSource: '<Betbot>',
    database: '<BetBot-Database>',
    collection: '<User-Data-Collection>',
    filter: {Username: username, Password: password}
   })
   .then((result) => {
    queryResult = result;
   })

  main_win.webContents.send("login_return", accResult);
  acc_username = acc_info.username;
})