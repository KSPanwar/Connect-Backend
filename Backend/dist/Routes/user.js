"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userSchema_1 = require("../validation/userSchema");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const routeAuthenticate_1 = __importDefault(require("../validation/routeAuthenticate"));
const jwt = require('jsonwebtoken');
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
router.get('/protected', routeAuthenticate_1.default, (req, res) => {
    res.status(200).json({ message: `Hello, user}!` });
});
//Sign-in route
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = userSchema_1.userSigninSchema.parse(req.body);
        if (!userData) {
            return res.status(400).json({ message: "Invalid Inputs" });
        }
        const { username, password } = userData;
        const existingUser = yield prisma.user.findUnique({
            where: { userName: username },
        });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, existingUser.password_hash);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const token = jwt.sign({ userId: existingUser.user_id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        // Here you could generate a token or session for the user
        //const cookieValue = existingUser.user_id;
        res.setHeader('Set-Cookie', [
            `token=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`,
        ]);
        res.status(200).json({ message: 'Sign-in successful', user: existingUser });
    }
    catch (error) {
        console.error('Error during signin:', error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = userSchema_1.userSignupSchema.parse(req.body);
        const { email, password, username } = userData;
        const existingUser = yield prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const existingUserName = yield prisma.user.findUnique({
            where: { userName: username },
        });
        if (existingUserName) {
            return res.status(400).json({ message: 'UserName is already takem' });
        }
        const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, saltRounds);
        const newUser = yield prisma.user.create({
            data: {
                email: email,
                password_hash: hashedPassword,
                userName: username, // Include username if needed
            },
        });
        return res.status(201).json({ message: 'User created successfully', user: newUser });
    }
    catch (error) {
        console.error('Error during signup:', error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
}));
exports.default = router;
