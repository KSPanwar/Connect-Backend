"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT authentication middleware
function authenticateJWT(req, res, next) {
    console.log(req.headers);
    if (!req.cookies || !req.cookies.token) {
        res.status(400).json({ message: 'Please set cookie' });
        return;
    }
    const token = req.cookies.token; // Retrieve token from cookies
    console.log('cookies' + req.cookies);
    if (!token) {
        res.status(403).json({ message: 'Access denied. No token provided.' });
        return;
    }
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log(jsonwebtoken_1.default.decode(token));
        req.userId = decoded.userId;
        console.log('In middleware routes' + decoded); // Attach decoded token to request (user info)
        next(); // Proceed to the next middleware or route handler
    });
}
exports.default = authenticateJWT;
