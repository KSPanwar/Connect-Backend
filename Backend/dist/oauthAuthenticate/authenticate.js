"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const authrouter = express_1.default.Router();
authrouter.get('/google', passport_1.default.authenticate('google'), (req, res) => {
    console.log(res);
    res.send("inside auth route");
});
authrouter.get('/google/callback', passport_1.default.authenticate('google', {
    failureRedirect: '/', // Redirect to homepage or error page if authentication fails
    successRedirect: '/dashboard' // Redirect to dashboard or desired page upon successful authentication
}), (req, res) => {
    // This callback is optional as redirection is handled by the options above
    res.send('Authentication successful!');
});
exports.default = authrouter;
