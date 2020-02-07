import { 
    configureRadiks,
    createBlockchainIdentity,
    initWallet, 
    initWalletFromSeed,
    makeUserSession, 
    makeProfileJSON, 
    saveProfileJSON  } from './../utils/profile';
// @ts-ignore
import { configure, User, UserGroup, GroupInvitation, Model, Central } from 'radiks';
  
  export async function createKeyChain(){
    let seed = process.env.SEED;
    console.log('seed', seed);
    let keychain = await initWalletFromSeed(seed);
    return keychain;
  }
  
  export async function loadServerSession(keychain: any){
    //console.log('keychain',  keychain);
    let id = await createBlockchainIdentity(keychain);
    //console.log('id',  id);
  
    let userSession = makeUserSession(id.appPrivateKey, id.appPublicKey, id.username, id.profileJSON.decodedToken.payload.claim);
    //console.log('userSession', userSession);
    await configureRadiks(userSession);
    //console.log('config radiks sesh');
    let blockstackUser = await User.createWithCurrentUser();
    // console.log('blockstackUser', blockstackUser)
    
    const radiksBatchAccount= {
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