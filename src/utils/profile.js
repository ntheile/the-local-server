"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sessionStore_1 = require("blockstack/lib/auth/sessionStore");
const bip39 = require("bip39");
// @ts-ignore
const _utils_1 = require("@utils"); // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
const crypto = require("crypto");
const blockstack = require("blockstack");
const radiks_1 = require("radiks");
const bitcoinjs = require('bitcoinjs-lib');
require("localstorage-polyfill");
// @ts-ignore
exports.initWallet = () => __awaiter(this, void 0, void 0, function* () {
    let action = 'none';
    const STRENGTH = 128; // 128 bits generates a 12 word mnemonic
    // save seed phrase to SecureStorage on the device, allow the user to backup 
    let backupPhraseCache = localStorage.getItem('backupPhrase');
    let backupPhrase;
    if (backupPhraseCache) {
        backupPhrase = backupPhraseCache;
    }
    else {
        action = 'create'; // 'updateAccount'
        backupPhrase = bip39.generateMnemonic(STRENGTH, crypto.randomBytes);
        yield localStorage.setItem('backupPhrase', backupPhrase);
    }
    let keychain = yield initWalletFromSeed(backupPhrase);
    return keychain;
});
function initWalletFromSeed(backupPhrase) {
    return __awaiter(this, void 0, void 0, function* () {
        let masterKeychain = null;
        let action = 'none';
        const seedBuffer = yield bip39.mnemonicToSeed(backupPhrase);
        masterKeychain = yield bitcoinjs.HDNode.fromSeedBuffer(seedBuffer);
        let keychain = {
            backupPhrase: backupPhrase,
            masterKeychain: masterKeychain,
            action: action
        };
        return keychain;
    });
}
exports.initWalletFromSeed = initWalletFromSeed;
function makeUserSession(appPrivateKey, appPublicKey, username, profileJSON = null, scopes = ['store_write', 'publish_data'], appUrl = 'goodtimesx.com', hubUrl = 'https://hub.blockstack.org') {
    // see https://forum.blockstack.org/t/creating-a-usersession-using-app-private-key/8096/4
    const appConfig = new blockstack.AppConfig(scopes, appUrl);
    const userData = {
        username: username,
        decentralizedID: 'did:btc-addr:' + appPublicKey,
        appPrivateKey: appPrivateKey,
        authResponseToken: '',
        hubUrl: hubUrl,
        identityAddress: appPublicKey,
        profile: profileJSON,
    };
    const dataStore = new sessionStore_1.InstanceDataStore({
        appPrivateKey: appPrivateKey,
        hubUrl: hubUrl,
        userData: userData
    });
    const userSession = new blockstack.UserSession({
        appConfig: appConfig,
        sessionStore: dataStore
    });
    return userSession;
}
exports.makeUserSession = makeUserSession;
function makeProfileJSON(profile, keypair, api) {
    let profileJSON = _utils_1.signProfileForUpload(profile, keypair, api);
    return profileJSON;
}
exports.makeProfileJSON = makeProfileJSON;
exports.saveProfileJSON = (userSession, profileJSON) => __awaiter(this, void 0, void 0, function* () {
    let resp = yield userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' });
    return resp;
});
function configureRadiks(userSession) {
    radiks_1.configure({
        apiServer: process.env.RADIKS_API_SERVER,
        userSession: userSession
    });
}
exports.configureRadiks = configureRadiks;
function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}
exports.rando = rando;
exports.createBlockchainIdentity = (keychain, username = "good" + rando() + '.id.blockstack', avatarUrl = 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0', identitiesToGenerate = 2) => __awaiter(this, void 0, void 0, function* () {
    const { identityKeypairs } = _utils_1.getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate);
    // use identity 0 for blockstack browser and profile
    let browserPublicKey = identityKeypairs[0].address;
    let browserPrivateKey = identityKeypairs[0].key;
    let browserKeyID = identityKeypairs[0].keyID;
    let profile = makeNewProfile(browserPrivateKey, browserPublicKey, avatarUrl, username);
    let userSession = makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
    let profileResp = exports.saveProfileJSON(userSession, [profile]);
    // use identity 1 for this first app keypair
    let appPublicKey = identityKeypairs[1].address;
    let appPrivateKey = identityKeypairs[1].key;
    return {
        appPublicKey: appPublicKey,
        appPrivateKey: appPrivateKey,
        identityKeypairs: identityKeypairs,
        profileJSON: profile,
        username: username,
        profileResp: profileResp
    };
});
function getPublicKeyFromPrivate(privateKey) {
    const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    return keyPair.publicKey.toString('hex');
}
exports.getPublicKeyFromPrivate = getPublicKeyFromPrivate;
function makeNewProfile(privateKey, publicKey, avatarUrl, username) {
    let api = {
        gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/'
        },
        gaiaHubUrl: 'https://hub.blockstack.org'
    };
    let profileJSON = makeProfileJSON(_utils_1.DEFAULT_PROFILE, { key: privateKey, keyID: publicKey }, api);
    let profile = (JSON.parse(profileJSON))[0];
    profile.decodedToken.payload.claim.image = [{
            '@type': 'ImageObject',
            'contentUrl': avatarUrl,
            'name': 'avatar'
        }];
    return profile;
}
exports.makeNewProfile = makeNewProfile;
//# sourceMappingURL=profile.js.map