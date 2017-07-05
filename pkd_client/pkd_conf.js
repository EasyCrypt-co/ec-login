/**
 * EasyCrypt.co Login
 * Copyright 2017, EasyCrypt.co
 * See README for details.
 *
 * @version 0.4.9
 */

pkdConf = {
    authURL: 'https://auth.easycrypt.co',
    pkdURL: 'https://pkd.easycrypt.co',
    numBits: 1024,
    api: {
        base: 'https://pkd.easycrypt.co',
        getPublicKeys: '/public/keys',
        addKeyPair: '/user/keys',
        getKeyPair: '/user/keys'
    }
}