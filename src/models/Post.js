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
// @ts-ignore
const model_1 = require("radiks/lib/model");
const prop_types_1 = require("prop-types");
const Comment_1 = require("./Comment");
class Post extends model_1.default {
    afterFetch() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            exports.posts = yield Comment_1.default.fetchList({
                // @ts-ignore
                postId: this.id,
            });
        });
    }
}
Post.className = 'Post';
Post.schema = {
    description: {
        type: String,
        decrypted: true,
    },
    image: {
        type: String,
        decrypted: true,
    },
    createdBy: {
        type: String,
        decrypted: true,
    },
    likes: {
        type: prop_types_1.number,
        decrypted: true,
    },
    placeId: {
        type: prop_types_1.string,
        decrypted: true
    }
};
exports.Post = Post;
//# sourceMappingURL=Post.js.map