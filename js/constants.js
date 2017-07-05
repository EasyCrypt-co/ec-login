/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

const MESSAGE_TYPE = {
    ERROR: "error",
    SUCCESS: "success",
    EMPTY: "empty"
};

const APP_CONFIG = {
    ecDomain: '.easycrypt.co',
    webMailURL: 'https://webmail.easycrypt.co',
    authURL: 'https://auth.easycrypt.co',
    accountURL: 'https://account.easycrypt.co',
    ecSecureCookie: 'on'
};

const URLS = {
    USER_INFO: "/ui",
    WEBMAIL_AUTH: "/auth/webmail",
    AUTH: "/auth",
    SUBSCRIBER: "/registration/subscriber",
    LOGIN: "/login/",
    SIGNUP: "/signup/"
};
