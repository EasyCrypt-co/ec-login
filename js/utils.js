/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

hashText = function (text, email) {
    return CryptoJS.SHA256(text+email.toLowerCase()).toString();
};

randomStr = function (length) {

    function getRandomInt(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    var randomChar = 'qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM0987654321';
    var str = '';
    for (var i = 0; i < length; i++) {
        str += randomChar.charAt(getRandomInt(0, randomChar.length - 1));
    }
    return str;
};

storePassphrase = function (passphrase) {
    localStorage.setItem("user_passphrase", btoa(encodeURIComponent(randomStr(8) + passphrase)));
    localStorage.setItem("passphrase_exp", new Date().getTime() + 120 * 60 * 1000);
};

clearLocalStorage = function () {
    var lockkey = "__lock_";
    var store = {};
    var skipparams = ['passphrase_exp'];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (skipparams.indexOf(key) >= 0)continue;
        store[key] = true;
    }

    for (var key in store) {
        localStorage.removeItem(key);
    }
};


getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
    return null;
};

isSafari = function () {
  var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 &&
                   navigator.userAgent && !navigator.userAgent.match('CriOS');
  return isSafari;
}
