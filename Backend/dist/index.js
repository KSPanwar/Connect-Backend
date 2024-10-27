"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const user_1 = __importDefault(require("./Routes/user"));
require("./config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dashboard_1 = __importDefault(require("./dashboard/dashboard"));
const authenticate_1 = __importDefault(require("./oauthAuthenticate/authenticate"));
const express_session_1 = __importDefault(require("express-session"));
require('./Strategies/google');
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET, // Replace with a secure secret in production
    resave: false, // Don't resave session if it hasn't changed
    saveUninitialized: false, // Only save sessions when initialized with data
    cookie: { secure: false } // Set to true if using HTTPS in production
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/user', user_1.default);
app.use('/dashboard', dashboard_1.default);
app.use('/auth', authenticate_1.default);
app.get('/', (req, res) => {
    res.send('Hello World! failure homepage');
});
app.listen(PORT, () => {
    console.log(`Running on Server ${PORT}`);
});
