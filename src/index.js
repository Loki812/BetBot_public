const electron = require('electron');

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

if(document.getElementById("login") != null) {
    document.getElementById("login").addEventListener("click", login);
}

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

function create(event) {
    document.getElementById("editable").innerHTML =
    `<div class="navbar_container">
        <div class="git">
        <a target="_blank" href="https://github.com/Loki812">
            <img src="../images/github-mark.png" alt="github" id="github">
        </a>
        </div> 
    </div>
    <div class="account_create>
        <form>
            <label for="username" id="username_label">Username:</label>
            <br>
            <input type="text" id="username" name="username" value="">
            <br>
            <label for="password" id="password_label">Password:</label>
            <br>
            <input type="password" id="password" name="password" value="">
            <br>
            <label for="password_repeat" id="password_repeat_label">
            Re-enter Password:
            </label>
            <br>
            <input type="password" id="password_repeat" name="password" value="">
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
            <button id="create" class="button">Create Account</button>
            <div id="failed_login_2"></div>
        </form>
    </div>
    `
}

if(document.getElementById("create_account_button") != null) {
    document.getElementById("create_account_button").addEventListener("click", create);
}