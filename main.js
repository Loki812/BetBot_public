var axios = require('axios');
const path = require('path');
const {app, BrowserWindow} = require('electron');
const electron = require('electron');
const { config } = require('process');
const { resolve } = require('path');

/************* API  commands **********/


function insertOne( Userdata ) {
	console.log(Userdata);

	var config = {
		method: 'post',
		url: 'https://data.mongodb-api.com/app/data-jhtgu/endpoint/data/v1/action/insertOne',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Request-Headers': '*',
			'api-key': 'xxxxxxxxxxxxxx'
		},
		data: JSON.stringify({
			"dataSource": "SchoolProject",
			"database": "BetBot-DataBase",
			"collection": "User-Data",
			"document": Userdata
		})
	}
	return config;
	
}

function findOne( filter ) {

	var config = {
		method: 'post',
		url: 'https://data.mongodb-api.com/app/data-jhtgu/endpoint/data/v1/action/findOne',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Request-Headers': '*',
			'api-key': 'xxxxxxxxxxxxx'
		},
		data: JSON.stringify({
			"dataSource": "SchoolProject",
			"database": "BetBot-DataBase",
			"collection": "User-Data",
			"filter": filter
		})
	}
	
	return config;
}

async function MONGO_create_acc( Userdata ) {

	const doesUsernameExist = await axios.request(
		findOne({'username': Userdata.username}))
		.then(result => result.data.document);

	console.log(doesUsernameExist);

	if(doesUsernameExist == null) {
		axios.request(insertOne(Userdata))


		return new Promise((resolve, reject) => {
			resolve(true);
		})
	}
	else {
		return new Promise((resolve, reject) => {
			resolve(false);
		});
	}
}

async function MONGO_login_acc( Userdata ) {

	const doesUserExist = await axios.request(
		findOne({'username': Userdata.username, 
		'password': Userdata.password}))
		.then(result => result.data.document)
		
	return new Promise((resolve, reject) => {
		resolve(doesUserExist);
	})
}


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

// lol
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

/******************** Login Event ********************/

/**
 * When the user clicks on the login (id="login" on index.html) button, and both input boxes
 * have content inside of them, index.js sends a signal to 
 * ipcMain renderer, in the "login_event" channel.
 * 
 * This event will query the mongodb database with the username and encrypted password,
 * and return the result (may be null).
 * 
 * @param {event} event: The event sent to ipcMain after the user clicks 
 * id="login" on index.html
 * 
 * @param {Object} acc_info: Two Fields meant to represent the account information
 * 		- username, taken from the id="username" input box in index.html
 * 		- password, taken from the id="password" input box in index.html (encrypted)
 */
electron.ipcMain.on("login_event", async (event, acc_info) => {
	
	// JSON Object
    const result = await MONGO_login_acc(acc_info);

	main_win.webContents.send("login_return", result);
	

})

/************* Account Creation Event *******************/

/**
 * When the user clicks the "create account" buttonon the page,
 * and it passed all tests to verify information was filled out,
 * index.js sends an event to main.js, where we can verify if the username 
 * already exists on the database
 * 
 *  - if it does, this event sends back a "failed" string, and the 
 * 	application will instruct the user to try again
 * 
 *  - if it does not, the event will call upon the mongodb api
 *  and insert a new document into our "User-Data-Collection"
 * 
 * @param {event} event: The event sent to ipcmain after the user
 * clicks the "create account" button
 * 
 * @param {Object} acc_info: Seven Fields meant to represent account information
 * 		- username: String from input box "username_create" on index.js
 * 		- password: String from input boc "password_create" on index.js, now encrpyted
 * 		- basketball: Boolean from checkbox "basketball" on index.js
 * 		- etc. for all other sports
 */
electron.ipcMain.on("create_event", async (event, acc_info) => { 
	
	const result = await MONGO_create_acc(acc_info);

	main_win.webContents.send("acc_creation", result);

})