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
const radiks_1 = require("radiks");
const Message_1 = require("./../models/Message");
const EncryptedMessage_1 = require("./../models/EncryptedMessage");
function radiksPutMessage(text) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        let message = new Message_1.default({
            content: text || rando().toString(),
            createdBy: 'uname',
            votes: []
        });
        let resp = yield message.save();
        //console.log('radiks resp', resp);
        console.log('radiks resp');
    });
}
exports.radiksPutMessage = radiksPutMessage;
function radiksPutEncryptedGroupMessage(text) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        let m = new EncryptedMessage_1.default({
            content: 'from samsung',
            createdBy: 'uname',
            votes: [],
            category: 'phone',
            userGroupId: ''
        });
        let resp = yield m.save();
        // console.log('radiks resp encrypted msg', resp);
        console.log('radiks resp encrypted msg');
    });
}
exports.radiksPutEncryptedGroupMessage = radiksPutEncryptedGroupMessage;
function radiksPutCentral() {
    return __awaiter(this, void 0, void 0, function* () {
        const key = 'UserSettings';
        const value = { email: 'myemail@example.com' };
        yield radiks_1.Central.save(key, value);
        const result = yield radiks_1.Central.get(key);
        // console.log(result); // { email: 'myemail@example.com' }
        console.log('radiksPutCentral');
    });
}
exports.radiksPutCentral = radiksPutCentral;
// https://github.com/ntheile/sheety-app/blob/1ff058fb602f2c62cf50dcd110160c7661b6ccdb/ClientApp/src/app/group/group.component.ts
function radiksGetMessage() {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        let messages = yield Message_1.default.fetchList({});
        // console.log('get messages ', messages);
        console.log('get messages ');
    });
}
exports.radiksGetMessage = radiksGetMessage;
function createRadiksGroup(groupName) {
    return __awaiter(this, void 0, void 0, function* () {
        const group = new radiks_1.UserGroup({ name: groupName });
        let groupResp = null;
        try {
            groupResp = yield group.create();
        }
        catch (e) {
            console.log('error', e);
        }
        // console.log('groupResp', groupResp);
        console.log('created group ' + groupName);
        return groupResp;
    });
}
exports.createRadiksGroup = createRadiksGroup;
function inviteMember(groupId, userToInvite) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`invited ${userToInvite} to group: ${groupId}`);
        let group = yield radiks_1.UserGroup.findById(groupId);
        const usernameToInvite = userToInvite;
        const invitation = yield group.makeGroupMembership(usernameToInvite);
        console.log('invitation._id', invitation._id); // the ID used to later activate an invitation
    });
}
exports.inviteMember = inviteMember;
function acceptInvitation(myInvitationID) {
    return __awaiter(this, void 0, void 0, function* () {
        const invitation = yield radiks_1.GroupInvitation.findById(myInvitationID);
        yield invitation.activate();
        console.log(`Accepted Invitation ${myInvitationID}`);
    });
}
exports.acceptInvitation = acceptInvitation;
function viewMyGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        const groups = yield radiks_1.UserGroup.myGroups();
        // console.log('My groups', groups);
        console.log('My groups ');
    });
}
exports.viewMyGroups = viewMyGroups;
function rando() {
    return (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
}
function GenGroupKeyPutCentral(placeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const key = placeId;
        console.log('creating place ' + placeId);
        let group = yield createRadiksGroup(key);
        const value = { group: group };
        yield radiks_1.Central.save(key, value);
        const result = yield radiks_1.Central.get(key);
        console.log('created central group in GenGroupKeyPutCentral', result);
        // console.log('created central');
        return group;
    });
}
exports.GenGroupKeyPutCentral = GenGroupKeyPutCentral;
//# sourceMappingURL=group.js.map