
function goToRegister() {
    let loginBox = document.getElementById('loginContainer');
    loginBox.innerHTML = `
        <div class="registerContainer">
            <div class="arrow"><img src="../icons/arrow.svg" id="icon" alt="SVG Image" width="100" height="100"></div>
            <h1 class="earthquakeDetector">EARTHQUAKE DETECTOR</h1>
            <h1 class="createANewAccount">Create a new account</h1>
            <div class="boxes">
                <div class="deviceID"><input type="text" placeholder="Device ID" class="deviceIdInput" id="device"></div>
                <div class="registerUsername"><input type="text" placeholder="Username" class="registerUsernameInput" id="registerUsername"></div>
                <div class="registerPassword"><input type="password" placeholder="Password" class="registerPasswordInput" id="registerPassword"></div>
                <div class="confirmPassword"><input type="password" placeholder="Confirm Password" class="confirmPasswordInput" id="confirmPassword"></div>
            </div>
            <div class="registerBox">Register</div>
      
   </div>
    `;
    const icon = document.getElementById('icon');
    icon.addEventListener('click', closeRegister);
}


function closeRegister() {
    let loginBox = document.getElementById('loginContainer');
    loginBox.innerHTML = `<section id="loginCredentials">
    <h1 id="earthquakeDetector">EARTHQUAKE DETECTOR</h1>
        <h1 class="loginToContinue">Log in to continue</h1>
        <div class="usernameBox">
            <label>
                <input type="text" placeholder="Username" class="usernameInput" id="username">
            </label>
        </div>
        <div class="passwordBox">
            <label>
                <input type="password" placeholder="Password" class="passwordInput" id="password">
            </label>
        </div>
        <div class="loginButton">Log in</div>
        <h3 class="or">Or</h3>

        <div class="lines">
            <div class="line1"> </div>
            <div class="line2"> </div>
        </div>

        <button class="registerButton" onclick="goToRegister()">Register</button>

</section>`;

}

