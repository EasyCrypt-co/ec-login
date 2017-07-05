/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

addMessage = function (element, type, msg) {
    switch (type) {
        case MESSAGE_TYPE.SUCCESS:
            //remove previous message labels
            $('.message-label').remove();
            //add message type class and append message label
            $(element).removeAttr('class')
                .addClass("green-msg")
                .append("<label class='message-label'>" + msg + "</label>");
            break;
        case MESSAGE_TYPE.ERROR:
            //remove previous message labels
            $('.message-label').remove();
            //add message type class and append message label
            $(element).removeAttr('class')
                .addClass("error-msg")
                .append("<label class='message-label'>" + msg + "</label>");
            break;
        case MESSAGE_TYPE.EMPTY:
            //reset status messages
            $(element).removeAttr('class')
                .addClass("no-msg")
                .empty();
            break;
        default:
            //do nothing
            break;
    }
};

enableDisableElement = function (element, disabled) {
    $(element).prop('disabled', disabled);
};