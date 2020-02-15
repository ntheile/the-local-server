// @ts-ignore
import { UserGroup, GroupInvitation, Central } from 'radiks';
// @ts-ignore
import Message from './../models/Message';
import EncryptedMessage from './../models/EncryptedMessage';
declare let window: any;
const { getDB } = require('radiks-server');
import { Db } from 'mongodb';
import 'localstorage-polyfill';


export async function createRadiksGroup(groupName: string){
    const group = new UserGroup({ name: groupName });
    let groupResp = null;
    try{
        groupResp =  await group.create();
    } catch(e) {
        console.log('error', e);
    }
    // console.log('groupResp', groupResp);
    console.log('created group ' + groupName);
    return groupResp;
}

export async function inviteMember(groupId: string, userToInvite: string){
    let group = await UserGroup.findById(groupId);
    const usernameToInvite = userToInvite;
    group.privateKey = await getGroupKeyFromCache(groupId);
    const invitation = await group.makeGroupMembership(usernameToInvite);
    let inviteId = invitation._id;
    console.log('invite id => ', inviteId); // the ID used to later activate an invitation
    // update the members in central store
    copyGroupKeyDataToCentral(groupId);
}


export async function acceptInvitation(myInvitationID: string){
    const invitation  = await GroupInvitation.findById(myInvitationID);
    await invitation.activate();
    // console.log(`Accepted Invitation ${myInvitationID}` );
    return invitation;
}

export async function viewMyGroups(){
    const groups = await UserGroup.myGroups();
    // console.log('My groups', groups);
    return groups;
}

function rando(){
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}

   
export async function genGroupKeyPutCentral(placeId: any){
    const key = placeId;
    console.log('creating place ' + placeId);
    let group = await createRadiksGroup(key);
    const value = { group: group };
    //await Central.save(key, value);
    //const result = await Central.get(key);
    const mongo: Db = await getDB(process.env.MONGODB_URI);    
    let result = await mongo.collection('radiks-central-data').update(
        {
            _id: key
        }, 
        {
            _id: key,
            group: group
        },
        {
            upsert: true
        }
    );

    // console.log('created central group in GenGroupKeyPutCentral', result);
    backupGroupMemberships();
    return group;
}


export async function copyGroupKeyDataToCentral(groupId: any){
    let group = await UserGroup.findById(groupId);
    const mongo: Db = await getDB(process.env.MONGODB_URI);
    let groupData: any = await mongo.collection('radiks-central-data').find( { 'group._id': groupId }).toArray();
    if (groupData.length < 1){
        console.log(`group with is  ${groupId} does not exist in central store`);
        return null;
    }
    let key = groupData[0]._id;
    group.privateKey = await getGroupKeyFromCache(groupId);
    // let result = await Central.save(key, value);
    // updateCentral
    let result = await mongo.collection('radiks-central-data').update(
        {
            _id: key
        }, 
        {
            _id: key,
            group: group
        },
        {
            upsert: true
        }
    );

    return result;
}

export async function backupGroupMemberships(){
    let groupMembership: any = localStorage.getItem('GROUP_MEMBERSHIPS_STORAGE_KEY');    
    const mongo: Db = await getDB(process.env.MONGODB_URI);
    let result = null;
    if (groupMembership){
        result = await mongo.collection('radiks-central-data').update(
            {
                _id: "GROUP_MEMBERSHIPS_STORAGE_KEY"
            }, 
            {  
                _id: "GROUP_MEMBERSHIPS_STORAGE_KEY",
                keys: groupMembership,
                keysObject: JSON.parse(groupMembership)
            },
            {
                upsert: true
            }
        );
    }
    return result;
}

export async function loadGroupMemberShipsFromMongoToLocalStorage(){
    const mongo: Db = await getDB(process.env.MONGODB_URI);
    let result = await mongo.collection('radiks-central-data').findOne( {  
        _id: "GROUP_MEMBERSHIPS_STORAGE_KEY"
    });
    if (result){
        let groupMembership = localStorage.setItem('GROUP_MEMBERSHIPS_STORAGE_KEY', result.keys);    
        return groupMembership;
    } else {
        return null;
    }
    
}

export async function getGroupKeyFromCache(groupId: string){
    const mongo: Db = await getDB(process.env.MONGODB_URI);
    let groups = await mongo.collection('radiks-central-data')
        .find({ "group._id": groupId })
        .project({"group.privateKey": 1})
        .toArray();
    let key = groups[0].group.privateKey;
    return key;
}


// export async function radiksPutCentral(){
//     const key = 'UserSettings';
//     const value = { email: 'myemail@example.com' };
//     await Central.save(key, value);
//     const result = await Central.get(key);
//     // console.log(result); // { email: 'myemail@example.com' }
//     console.log('radiksPutCentral');
// }


// export async function radiksPutMessage(text: string) {
//     // @ts-ignore
//     let message = new Message({
//         content: text || rando().toString(),
//         createdBy: 'uname',
//         votes: []
//     });
//     let resp = await message.save();
//     //console.log('radiks resp', resp);
//     console.log('radiks resp');
// }


// export async function radiksPutEncryptedGroupMessage(text: string) {
//     // @ts-ignore
//     let m = new EncryptedMessage({
//         content: 'from samsung',
//         createdBy: 'uname',
//         votes: [], 
//         category: 'phone',
//         userGroupId: ''
//         });
//     let resp = await m.save();
//     // console.log('radiks resp encrypted msg', resp);
//     console.log('radiks resp encrypted msg');
// }
