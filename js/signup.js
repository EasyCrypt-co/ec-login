/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

function goToLogin() {
    window.location.replace(APP_CONFIG.webMailURL + URLS.LOGIN);
}

function initiateRegisterProcess(event) {
    event.preventDefault();

    // Reset status messages
    addMessage('#signup_notification', MESSAGE_TYPE.EMPTY, "");

    var email = $("#register_email").val();

    if (email) {
        enableDisableElement("#signup_menu_btn", true);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: APP_CONFIG.authURL + URLS.SUBSCRIBER,
            data: JSON.stringify({"email": email}),
            dataType: 'json',
            success: function (data, statusText, xhr) {
                
                // All good user registered
                if (xhr.status == 200) {
                    $("#register_email").val("");
                    addMessage('#signup_notification', MESSAGE_TYPE.SUCCESS, "Verification email sent.<br/>Please check your Inbox and Spam folders");
                    enableDisableElement("#signup_menu_btn", false);
                    $(".register-form").hide();
                    $(".close-btn").show();
                }
            },
            error: function (data) {
                console.log(data);
                var emailCopy = email;
                var domain = emailCopy.replace(/.*@/, "");
                addMessage('#signup_notification', MESSAGE_TYPE.ERROR, "We're sorry, registering with " + domain + " is not possible. Please attempt to register with a different email address");
                enableDisableElement("#signup_menu_btn", false);
            }
        });
    }
    else {
        addMessage('#signup_notification', MESSAGE_TYPE.ERROR, "Please provide a valid email address");
    }
    return false;
}
