// @ts-ignore
import { UserGroup, GroupInvitation, Central } from 'radiks';
// @ts-ignore
import Message from './../models/Message';
import EncryptedMessage from './../models/EncryptedMessage';
declare let window: any;

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
    console.log(`invited ${userToInvite} to group: ${groupId}`)
    let group = await UserGroup.findById(groupId);
    const usernameToInvite = userToInvite;
    const invitation = await group.makeGroupMembership(usernameToInvite);
    // console.log('invitation._id', invitation._id); // the ID used to later activate an invitation
    return invitation;
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
    const key = "place_" + placeId;
    console.log('creating place ' + placeId);
    let group = await createRadiksGroup(key);
    const value = { group: group };
    await Central.save(key, value);
    const result = await Central.get(key);
    // console.log('created central group in GenGroupKeyPutCentral', result);
    return group;
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
