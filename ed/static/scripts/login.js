function goToRegister() {
    let loginBox = document.getElementById('loginContainer');
    loginBox.innerHTML = `
        <div class="registerContainer">
            <div><img src="../static/icons/arrow.svg" id="back" alt="arrow" class="arrow"></div>
            <h1 id="earthquakeDetector">EARTHQUAKE DETECTOR</h1>
            <h1 class="loginToContinue">Create a new account</h1>
            <form action="/register" method="post">
                <div class="deviceID">
                <label for="device"></label>
                <input type="text" id="deviceId" name="deviceId" placeholder="Device ID" required>
            </div>
            <div class="registerUsername">
                <label for="registerUsername"></label>
                <input type="text" id="registerUsername" name="username" placeholder="Username" required>
            </div>
            <div class="registerPassword">
                <label for="registerPassword"></label>
                <input type="password" id="registerPassword" name="password" placeholder="Password" required>
            </div>
            <div class="loginButton">
                <button type="submit">Register</button>
            </div>
            </form>
   </div>
    `;
    const icon = document.getElementById('back');
    icon.addEventListener('click', closeRegister);
}


function closeRegister() {
    let loginBox = document.getElementById('loginContainer');
    loginBox.innerHTML = `
        <div>
            <h1 id="earthquakeDetector">EARTHQUAKE DETECTOR</h1>
            <h1 class="loginToContinue">Log in to continue</h1>
        </div>

        <form action="/login" method="post" id="login-form">
            <div class="usernameInput">
                <label for="username"></label>
                <input type="text" id="username" name="username" placeholder="Username" required>
            </div>
            <div class="passwordInput">
                <label for="password"></label>
                <input type="password" id="password" name="password" placeholder="Password" required>
            </div>
            <div class="loginButton">
                <button type="submit">Log in</button>
            </div>
        </form>

        <div>
            <h3 class="or">Or</h3>

            <div class="lines">
                <div class="line1"></div>
                <div class="line2"></div>
            </div>
        </div>

        <button class="registerButton" onclick="goToRegister()">Register</button>`;
}

