"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const model_1 = require("radiks/lib/model");
// @ts-ignore
class Comment extends model_1.default {
}
Comment.className = 'Comment';
Comment.schema = {
    text: {
        type: String,
        decrypted: true,
    },
    createdBy: {
        type: String,
        decrypted: true,
    },
    postId: {
        type: String,
        decrypted: true,
    }
};
exports.default = Comment;
//# sourceMappingURL=Comment.js.map