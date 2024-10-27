"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSigninSchema = exports.userSignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
//user registration signIn v
exports.userSignupSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(20),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.userSigninSchema = zod_1.default.object({
    username: zod_1.default.string().min(3).max(20),
    password: zod_1.default.string().min(6)
});
