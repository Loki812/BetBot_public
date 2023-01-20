const createMongoDBDataAPI = require('mongodb-data-api');
const path = require('path');
const {app, BrowserWindow} = require('electron');
const electron = require('electron');

// creating api constant
const api = createMongoDBDataAPI.createMongoDBDataAPI({
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
    var queryResult;

    await api.findOne( {
      dataSource: '<Betbot>',
      database: '<BetBot-Database>',
      collection: '<User-Data-Collection>',
      filter: {Username: acc_info.username, Password: acc_info.password}
     })
     .then((result) => {
      queryResult = result.document;
     })

    main_win.webContents.send("login_return", queryResult);
})

/************* Account Creation Event *******************/

electron.ipcMain.on("create_event", (event, acc_info) => {
  var queryResult;

  await api.findOne( {
    dataSource: '<Betbot>',
    database: '<BetBot-Database>',
    collection: '<User-Data-Collection',
    filter: {Username: acc_info.username}
  })
  .then((result) => {
    queryResult = result.document;
  })

  if(queryResult == null) {
    await api.insertOne({
      dataSource: '<Betbot',
      database: '<Betbot-Database>',
      collection: '<User-Data-Collection',
      document: {
        Username: acc_info.username,
        Password: acc_info.password,
        Basketball: acc_info.basketball,
        Baseball: acc_info.baseball,
        Football: acc_info.football,
        Hockey: acc_info.hockey,
        Soccer: acc_info.soccer
      }
    }).then((result) => {
      main_win.webContents.send("create_return", "success");
    })
  }
  else {
    main_win.webContents.send("create_return", "failed");
  }
})