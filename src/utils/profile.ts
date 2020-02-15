// @ts-ignore
import { InstanceDataStore } from 'blockstack/lib/auth/sessionStore';
// @ts-ignore
import { UserData } from 'blockstack/lib/auth/authApp';
import * as bip39 from 'bip39';
// @ts-ignore
import * as bip32utils from 'bip32-utils';
// @ts-ignore
import { getBlockchainIdentities, signProfileForUpload, DEFAULT_PROFILE } from '@utils'; // copied from the blockstack browser project utils https://github.com/blockstack/blockstack-browser/tree/master/app/js/utils
import * as crypto from 'crypto'
// @ts-ignore
import * as blockstack from 'blockstack';
// @ts-ignore
import { configure } from 'radiks';
const bitcoinjs = require('bitcoinjs-lib');
import 'localstorage-polyfill';
// @ts-ignore
import { makeAuthResponse } from 'blockstack/lib/auth/index';


export const initWallet = async () => {
    let action = 'none';
    const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
    // save seed phrase to SecureStorage on the device, allow the user to backup 
    let backupPhraseCache = localStorage.getItem('backupPhrase');
    let backupPhrase;
    if (backupPhraseCache) {
        backupPhrase = backupPhraseCache
    } else {
        action = 'create'; // 'updateAccount'
        backupPhrase = bip39.generateMnemonic(STRENGTH, crypto.randomBytes )
        await localStorage.setItem('backupPhrase', backupPhrase);
    }
    let keychain = await initWalletFromSeed(backupPhrase);
    return keychain;
}

export async function initWalletFromSeed(backupPhrase: any){
    let masterKeychain = null
    let action = 'none';
    const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = await bitcoinjs.HDNode.fromSeedBuffer(seedBuffer)
    let keychain = {
        backupPhrase: backupPhrase,
        masterKeychain: masterKeychain,
        action: action
    }
    return keychain;
}

export function makeUserSession(appPrivateKey: string, appPublicKey: string, username: string, profileJSON: any = null, scopes: Array<string> = ['store_write', 'publish_data'], appUrl: string = 'goodtimesx.com', hubUrl: string = 'https://hub.blockstack.org') {
    // see https://forum.blockstack.org/t/creating-a-usersession-using-app-private-key/8096/4

    const appConfig = new blockstack.AppConfig(
        scopes,
        appUrl
    )
    
    let authResponseToken = makeAuthResponse(appPrivateKey, profileJSON, username, null);
      
    const userData: UserData = {
        username: username,
        decentralizedID: 'did:btc-addr:' + appPublicKey,
        appPrivateKey: appPrivateKey,
        authResponseToken: authResponseToken,
        hubUrl: hubUrl,
        identityAddress: appPublicKey,
        profile: profileJSON,
    }

    const dataStore = new InstanceDataStore({
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

export function makeProfileJSON(profile: any, keypair: any, api: any) {
    let profileJSON = signProfileForUpload(profile, keypair, api);
    return profileJSON;
}

export const saveProfileJSON = async (userSession: any, profileJSON: any) => {
    let resp = await userSession.putFile('profile.json', JSON.stringify(profileJSON), { encrypt: false, contentType: 'application/json' })
    return resp;
}

export function configureRadiks(userSession: any) {
    configure({
        apiServer: process.env.RADIKS_API_SERVER, //`http://localhost:5000`,  
        userSession: userSession
    });
}


export function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}

export const createBlockchainIdentity = async (
    keychain: any, 
    username:string =  process.env.USER_ID || "good" + rando() + '.id.blockstack',  
    avatarUrl: string = 'https://gaia.blockstack.org/hub/17xxYBCvxwrwKtAna4bubsxGCMCcVNAgyw/avatar-0',  
    identitiesToGenerate: number = 2
) => {

    const { identityKeypairs } = getBlockchainIdentities(keychain.masterKeychain, identitiesToGenerate)
    // use identity 0 for blockstack browser and profile
    let browserPublicKey = identityKeypairs[0].address;
    let browserPrivateKey = identityKeypairs[0].key;
    let browserKeyID = identityKeypairs[0].keyID;
    let profile = makeNewProfile(browserPrivateKey, browserPublicKey, avatarUrl, username);
    let userSession = makeUserSession(browserPrivateKey, browserPublicKey, username, profile.decodedToken.payload.claim);
    let profileResp = saveProfileJSON(userSession, [profile]);
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
    }
}


export function getPublicKeyFromPrivate(privateKey: string) {
    const keyPair = bitcoinjs.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    return keyPair.publicKey.toString('hex')
}

export function makeNewProfile(privateKey: string, publicKey: string, avatarUrl: string, username: string){
    let api = {
        gaiaHubConfig: {
            url_prefix: 'https://gaia.blockstack.org/hub/'
        },
        gaiaHubUrl: 'https://hub.blockstack.org'
    }
    let profileJSON = makeProfileJSON(DEFAULT_PROFILE, { key: privateKey, keyID: publicKey}, api);
    let profile = (JSON.parse(profileJSON))[0];
    profile.decodedToken.payload.claim.image = [{
        '@type': 'ImageObject',
        'contentUrl': avatarUrl,
        'name': 'avatar'    
    }]
    return profile;                              
}