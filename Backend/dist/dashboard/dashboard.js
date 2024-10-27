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
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const dashboard = express_1.default.Router();
const prisma = new client_1.PrismaClient();
//dashboard.use(authenticateJWT);
let allowedConnector;
const upload = (0, multer_1.default)({ dest: 'uploads/' });
dashboard.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = Number(req.userId);
        allowedConnector = yield prisma.userOAuthAccount.findMany({
            where: { user_id: user_id },
            include: {
                provider: {
                    select: {
                        provider_name: true
                    }
                }
            }
        });
        for (let i = 0; i < allowedConnector.length; i++) {
            console.log('access token', allowedConnector[i].access_token);
        }
        console.table(allowedConnector);
        res.status(200).json({ message: `Hello, from dashboard`, allowedConnector });
    }
    catch (error) {
        console.error('Error fetching allowed connectors:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
}));
dashboard.post('/post', upload.single('video'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, appList } = req.body;
        //put file path here
        if (!title || !appList.youtube || appList.youtube !== 'yes') {
            return res.status(400).json({ message: 'Missing required video data' });
        }
        const appsToPost = Object.keys(appList).filter(app => appList[app] === 'yes');
        if (appsToPost.length === 0) {
            return res.status(400).json({ message: 'At least one app must be selected for posting' });
        }
        const authenticatedApps = allowedConnector.filter(connector => appsToPost.includes(connector.provider.provider_name.toLowerCase()));
        const notAuthenticatedApps = appsToPost.filter(app => !authenticatedApps.some(authApp => authApp.provider.provider_name.toLowerCase() === app));
        if (notAuthenticatedApps.length > 0) {
            return res.status(400).json({
                message: 'Some selected apps are not connected for posting',
                notAuthenticatedApps
            });
        }
        for (const app of authenticatedApps) {
            console.log(`Posting to ${app.provider.provider_name} with access token: ${app.access_token}`);
            switch (app.provider.provider_name.toLowerCase()) {
                case 'youtube':
                    //await uploadVideo(title,description);
                    break;
                // case 'instagram':
                //     await postToInstagram(post.filePath, post.caption);
                //     break;
                // case 'linkedin':
                //     await postToLinkedIn(post.content, post.link);
                //     break;
                default:
                    console.log(`No handler for ${app.provider.provider_name}`);
            }
        }
        return res.status(200).json({ message: 'Post submitted successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occurred while posting' });
    }
}));
exports.default = dashboard;
