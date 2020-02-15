import {
  configureRadiks,
  createBlockchainIdentity,
  initWallet,
  initWalletFromSeed,
  makeUserSession,
  makeProfileJSON,
  saveProfileJSON
} from './../utils/profile';
// @ts-ignore
import { configure, User, UserGroup, GroupInvitation, Model, Central } from 'radiks';
const { 
  verifyAuthResponse, isExpirationDateValid, isIssuanceDateValid, doSignaturesMatchPublicKeys, doPublicKeysMatchIssuer 
} = require('blockstack/lib/auth/authVerification');
// @ts-ignore
import { decodeToken, TokenVerifier } from 'jsontokens';


export async function createKeyChain() {
  let seed = process.env.SEED;
  console.log('seed', seed);
  let keychain = await initWalletFromSeed(seed);
  return keychain;
}

export async function loadServerSession(keychain: any) {
  //console.log('keychain',  keychain);
  let id = await createBlockchainIdentity(keychain);
  //console.log('id',  id);

  let userSession = makeUserSession(id.appPrivateKey, id.appPublicKey, id.username, id.profileJSON.decodedToken.payload.claim);
  //console.log('userSession', userSession);
  await configureRadiks(userSession);
  //console.log('config radiks sesh');
  let blockstackUser = await User.createWithCurrentUser();
  // console.log('blockstackUser', blockstackUser)

  const radiksBatchAccount = {
    backupPhrase: keychain.backupPhrase,
    publicKey: id.appPublicKey,
    privateKey: id.appPrivateKey,
    userSession: userSession,
    username: id.username,
    error: 'none',
    profileJSON: id.profileJSON
  }
  console.log('created radiksBatchAccount for the server! ', radiksBatchAccount);
  return radiksBatchAccount;

  // save to the server
}


export async function verifyUser(authResponseToken: any){
  let nameLookupURL: string = "https://core.blockstack.org/v1/names/"
  try {
       const payload = decodeToken(authResponseToken).payload
       if (typeof payload === 'string') {
           throw new Error('Unexpected token payload type of string')
       }
       if (!payload.username) {
           return true
       }
       if (payload.username === null) {
           return true
       }
       if (nameLookupURL === null) {
           return false
       }

       const username: any = payload.username;
       let isVerified = false;
       // if (username.includes('good')){
          // do manual test
          isVerified = await verifyAuthResponseExcludingUserName(authResponseToken);
       //} else { @todo look into verifiying with blockstack verifyAuthResponse method
       //   isVerified = await verifyAuthResponse(authResponseToken, nameLookupURL);
       //}

       if (isVerified){
         return username;
       } else {
         return null;
       }

   } catch (error) {
       console.log(error)
       console.log('Error checking `doPublicKeysMatchUsername`')
       return false;
   }
}


export async function verifyAuthResponseExcludingUserName(authResponseToken: string){
  const values = await Promise.all([
    isExpirationDateValid(authResponseToken),
    isIssuanceDateValid(authResponseToken),
    doSignaturesMatchPublicKeys(authResponseToken),
    doPublicKeysMatchIssuer(authResponseToken),
  ])
  return values.every(val => val)
}