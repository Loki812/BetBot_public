const electron = require('electron');

function make_visible( page ) { 

    let username = document.getElementById("username");
    let password = document.getElementById("password");
    let login = document.getElementById("login");
    let create = document.getElementById("create");
    let back_button = document.getElementById("back_button");

    username.style.transitionDuration = "0";
    password.style.transitionDuration = "0";
    login.style.transitionDuration = "0";
    create.style.transitionDuration = "0";
    back_button.style.transitionDuration = "0";

    if(page) {
        username.style.visibility = "hidden";
        password.style.visibility = "hidden";
        login.style.visibility = "hidden";
        create.style.visibility = "visible";
        back_button.style.visibility = "visible";
    }
    else {
        username.style.visibility = "visible";
        password.style.visibility = "visible";
        login.style.visibility = "visible";
        create.style.visibility = "hidden";
        back_button.style.visibility = "hidden";
    }

    username.style.transitionDuration = "0.4s";
    password.style.transitionDuration = "0.4s";
    login.style.transitionDuration = "0.4s";
    create.style.transitionDuration = "0.4s";
    back_button.style.transitionDuration = "0.4s";

}

/**
 * The function login is to be attached to a listener event
 * on thg 'login' button on the navbar, it grabs the value
 * from the username and password divs, and compares it to
 * an equivulent entry in our SQL database. If successful
 * it will showcase the user's current bets. 
 * 
 * @param {*} event: Click event attached to the 'Login' div
 * in navbar_container 
 */
function login( event ) {
    event.preventDefault();
    var login_el = document.getElementById("login");

    login_el.innerHTML = 
    `<div class='loader'></div>`;
    document.styleSheets[0].deleteRule(16);
    document.getElementById("main").style.cursor = "progress"
    login_el.style.cursor = "progress"
    login_el.removeEventListener("click", login)

    var acc_info = {
        'username': document.getElementById("username").value,
        'password': window.btoa(document.getElementById("password").value)
    } 
    electron.ipcRenderer.send("login_event", acc_info);
}

// verifys that we have a login div on screen
if(document.getElementById("login") != null) {
    document.getElementById("login").addEventListener("click", login);
}

// signal that the server has responed to the login attempt. If successful
// the event will contain the user's current bets. If not the window displays
// the message "wrong username or password".
electron.ipcRenderer.on("login_return", (event, result, username) => {
    document.getElementById("main").style.cursor = "auto";
    document.getElementById("login").style.cursor = "pointer";
    if(result == "success") {
        document.getElementById("navbar_container").innerHTML = 
        `<div class="navbar_item" id="welcome"> Welcome, 
        ` + username + `</div>`;
        // TODO loading bets, scores etc.
    }
    else {
        document.getElementById("login").innerHTML = `Login`
        document.styleSheets[0].insertRule(`#login:hover {
            background-color: #ebebeb;
            color: black;
            border-color: black;
            opacity: .8;
            transform: scale(1.1);
        }`, 16);
        document.getElementById("failed_login").innerHTML = 
        `<u>Failed to login, wrong username or password</u>`;
        document.getElementById("login").addEventListener("click", login);
    }
})

/******************** Create Account events/functions ***********************/

function verify_account( account ) {
    let upper_case = /[A-Z]/;
    let special_char = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let failed_login = document.getElementById("failed_login_2");

    // add mongo call to see if username is taken
    if(account.username.length > 3) {
        if(account.password.length > 7) {
            if(upper_case.test(account.password) ||
            special_char.test(account.password))
                return true;
        }
        failed_login.innerHTML = `<u>Password requires: <br>
         - atleast 8 characters, <br> - atleasts one uppercase or <br> 
        1 special character</u>`
        return false;
    }
    failed_login.innerHTML = `<u>Username is already taken</u>`
    return false;
}


function create_account( event ) {
    document.getElementById("create").innerHTML = `<div class='loader'></div>`;
    document.getElementById("main").style.cursor = "progress"
    document.getElementById("create").style.cursor = "progress"

    // verifys the user put in the same password twice
    if(document.getElementById("password_create").value ==
    document.getElementById("password_repeat_create").value) {
        var account = {
            "username": document.getElementById("username_create").value,
            "password": document.getElementById("password_create").value,
            "basketball": document.getElementById("basketball").checked,
            "baseball": document.getElementById("baseball").checked,
            "football": document.getElementById("football").checked,
            "hockey": document.getElementById("hockey").checked,
            "soccer": document.getElementById("soccer").checked
        }
        if(verify_account(account)) {
            electron.ipcRenderer.send("create_event", account);
        }
    }
    else {
        document.getElementById("failed_login_2").innerHTML = `
        <u> Password attempts must match`
    }

    

}

/**
 * The function change_dom, manipulates the dom by displaying a form that 
 * contains input boxs for user data, username, password, repeat_password. 
 * Along with posrts preferances for the user.
 * 
 * @param {*} event: Click event on the "create_account_button" div. 
 */
function change_dom(event) {

    make_visible(true);

    document.getElementById("editable").innerHTML = `
    <div class="account_create_container">
                <div class="account_create">
                    <form>
                        <h1 class="create_title">Create an account:</h1>
                        <input class="create_input" type="text" id="username_create" 
                        value="" placeholder="Username">
                        <br>
                        <input class="create_input" type="password" id="password_create" 
                        value="" placeholder="Password">
                        <br>
                        <input class="create_input" type="password" id="password_repeat_create" 
                        value="" placeholder="Re-enter password">
                        <br>
                        <div class="sports_wrapper">
                            <div class="checkbox-rect">
                                <input type="checkbox" id="basketball">
                                <label for="basketball">Basketball</label>
                            </div>
                            <div class="checkbox-rect">
                                <input type="checkbox" id="baseball">
                                <label for="baseball">Baseball</label>
                            </div>
                        </div>
                        <div class="sports_wrapper">
                            <div class="checkbox-rect">
                                <input type="checkbox" id="football">
                                <label for="football">Football</label>
                            </div>
                            <div class="checkbox-rect" id="hockey_but">
                                <input type="checkbox" id="hockey">
                                <label for="hockey">Hockey</label>
                            </div>
                        </div>
                        <div class="sports_wrapper">
                            <div class="checkbox-rect" id="soccer_but">
                                <input type="checkbox" id="soccer">
                                <label for="soccer">Soccer</label>
                            </div>
                        </div>
                        <div id="failed_login_2"></div>
                    </form>
                </div>
            </div>
    `
    
    if(document.getElementById("create") != null) {
        document.getElementById("create").addEventListener("click", create_account);
    }
}

// verifys that there is a create_account button div on the page
if(document.getElementById("create_account_button") != null) {
    document.getElementById("create_account_button").addEventListener("click", change_dom);
}

/**************************** Switching back to main screen *************/

function change_dom_back( event ) {

    make_visible(false)

    document.getElementById("editable").innerHTML = `
    <div class="content_container">
        <div class="betting_container">
                <div class="betting_title">
                    <p>Current Bets:</p>
                </div>
                <div id="prizepicks"></div>
                <div id="bets_displayed">
                    <p id="create_account_button">
                        Dont have a account? Click here to get started.
                    </p>
                    <div class="temp_for_loader">
                        <div class="loader" id="make_green"></div>
                    </div>
                </div>
            </div>
            <div class="scores_container">
                <div class="scores_title">
                    <p>Scores to watch:</p>
                </div>                    
                <div id="scores_displayed">
                    <div class="loader" id="make_green"></div>
                </div>
            </div>        
    </div>`;

    document.getElementById("create").removeEventListener("click", create_account);
    if(document.getElementById("create_account_button") != null) {
        document.getElementById("create_account_button").addEventListener("click",change_dom);
    }

}

if(document.getElementById("back_button") != null) {
    document.getElementById("back_button").addEventListener("click", change_dom_back);
}