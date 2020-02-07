"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const model_1 = require("radiks/lib/model");
class EncryptedMessage extends model_1.default {
}
EncryptedMessage.className = 'EncryptedMessage';
EncryptedMessage.schema = {
    content: {
        type: String,
    },
    category: {
        type: String,
        decrypted: true,
    },
    createdBy: {
        type: String,
        decrypted: true,
    },
    _id: {
        type: String,
        decrypted: true
    },
    userGroupId: {
        type: String,
        decrypted: true,
    }
};
exports.default = EncryptedMessage;
//# sourceMappingURL=EncryptedMessage.js.map