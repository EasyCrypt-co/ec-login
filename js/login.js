/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

$(document).ready(function () {
    var email = getUrlParameter("user");
    if (email) {
        $('#login_user').val(email);
    }
    $('#form').show();
});

function goToSignup() {
    window.location.replace(APP_CONFIG.webMailURL + URLS.SIGNUP);
}

let token = null;
function setCustomLogin() {
  if(isSafari()) {
    var formspac = document.getElementsByClassName('form-spac2')[0];
    var unsupported = document.getElementsByClassName('unsupported-browser')[0];
    formspac.classList.add('hide-element');
    unsupported.classList.remove('hide-element');
  }
}
function checkLogin() {
    var email = getUrlParameter("user");
    if (email) {
        $('#login_user').val(email);
        $('#form').show();
    }
    else {
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: APP_CONFIG.authURL + URLS.USER_INFO,
            crossDomain: true,
            xhrFields: {
                withCredentials: true
            },
            dataType: 'json',
            success: function (data, statusText, xhr) {
                // All good user authenticated
                if (xhr.status == 200) {
                    // Redirect to webmail
                    window.location.replace(APP_CONFIG.webMailURL + "/?_task=login&_action=login");
                }
            },
            error: function (data) {
                localStorage.removeItem("user_passphrase");
                clearLocalStorage();
                $('#form').show();
            },
        });
    }
}

function secretDecrypted(data) {
    // Ask for webmail permission
    $.ajax({
        type: 'POST',
        contentType: 'application/json',
        url: APP_CONFIG.authURL + URLS.WEBMAIL_AUTH,
        data: JSON.stringify({"client_token": data}),
        headers: {
            'X-EC-UI': token
        },
        dataType: 'json',
        success: function (data, statusText, xhr) {
            // All good user authenticated
            if (xhr.status == 200) {
                // Set JWT token for Webmail authentication
                Cookies.set('ec_jwt', data.data.ec_jwt,
                    {
                        'domain': APP_CONFIG.ecDomain,
                        secure: (APP_CONFIG.ecSecureCookie == "on") ? true : false
                    });
                var src = getUrlParameter("src");
                if (src == "account") {
                    var deleteId = getUrlParameter("deleteId");
                    if (deleteId) {
                        window.location.replace(APP_CONFIG.accountURL + "/delete?id=" + deleteId);
                    }
                    else {
                        window.location.replace(APP_CONFIG.accountURL);
                    }
                }
                else {
                    // Redirect to webmail
                    window.location.replace(APP_CONFIG.webMailURL + "/?_task=login&_action=login");
                }
            }
        },
        error: function (error) {
            console.log(error);
            addMessage('#login_notification', MESSAGE_TYPE.ERROR, "Invalid username or password");
            enableDisableElement("#login_menu_btn", false);
        }
    });
}

function decryptSecretAndCredentials(data) {
    passphrase = localStorage.getItem("user_passphrase");
    passphrase = decodeURIComponent(atob(passphrase)).substr(8);

    pkd = new PKDClient(null, passphrase, true);

    //
    let decryptSecret = pkd.decrypt({body: atob(data.data.secret), binary: null, format: null}, token);
    let decryptCredentials = pkd.decrypt({body: atob(data.data.credentials), binary: null, format: null}, token);

    Promise.all([decryptSecret, decryptCredentials]).then( (result) => {
      let body = {
        secret : result[0],
        credentials : result[1]
      };

      let iv = CryptoJS.lib.WordArray.random(16);
      let key = CryptoJS.enc.Hex.parse(result[0]);
      let encrypted = CryptoJS.AES.encrypt(JSON.stringify(body), key, { mode: CryptoJS.mode.CFB, padding: CryptoJS.pad.Pkcs7, iv:iv });

      let client_token = iv.toString()+encrypted.toString();

      secretDecrypted(client_token);
    }).catch(function (error) {
        console.log(error);
        addMessage('#login_notification', MESSAGE_TYPE.ERROR, "Invalid username or password");
        enableDisableElement("#login_menu_btn", false);
    });
}

function initiateLoginProcess(event) {
    event.preventDefault();

    // Reset status messages
    addMessage('#login_notification', MESSAGE_TYPE.EMPTY, "");
    addMessage('#login_notification', MESSAGE_TYPE.SUCCESS, "Unlocking mailbox...");

    var email = $("#login_user").val();
    var password = $("#login_pass").val();

    if (email && email != "" && password && password != "") {
        enableDisableElement("#login_menu_btn", true);

        var hash = hashText(password, email);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: APP_CONFIG.authURL + URLS.AUTH,
            data: JSON.stringify({"email": email, "password": hash}),
            dataType: 'json',
            success: function (data, statusText, xhr) {

                // All good user authenticated
                if (xhr.status == 200) {

                    token = data.data.ec_jwt;
                    clearLocalStorage();
                    storePassphrase(password);
                    decryptSecretAndCredentials(data);
                }
            },
            error: function (data) {
                console.log(data);
                addMessage('#login_notification', MESSAGE_TYPE.ERROR, "Invalid username or password");
                enableDisableElement("#login_menu_btn", false);
            }
        });
    }
    else {
        addMessage('#login_notification', MESSAGE_TYPE.ERROR, "Please provide the username and password");
    }
    return false;
}
