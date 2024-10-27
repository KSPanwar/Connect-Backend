import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import authenticateJWT from '../validation/routeAuthenticate';
import { UserOAuthAccount } from '../Interface/userconnectdb';
import { any } from 'zod';
import passport from 'passport';
import multer from 'multer';
import fs from 'fs';
import { uploadVideo } from '../Apppost/google';
const dashboard =  express.Router();
const prisma = new PrismaClient();
//dashboard.use(authenticateJWT);
let allowedConnector : UserOAuthAccount[];
const upload = multer({ dest: 'uploads/' });


dashboard.get('/',async (req:Request,res:Response)=>{
    try {
        const user_id = Number(req.userId);
     allowedConnector =  await prisma.userOAuthAccount.findMany({
        where:{user_id:user_id},
        include :{
            provider:{
                select:{
                    provider_name:true
                }
            }
        }
    })
    for(let i=0;i<allowedConnector.length;i++){
        console.log('access token',allowedConnector[i].access_token)
    }
    console.table(allowedConnector);

     res.status(200).json({ message: `Hello, from dashboard`,allowedConnector });
    } catch (error) {
        console.error('Error fetching allowed connectors:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
})

dashboard.post('/post',upload.single('video') ,async (req:Request,res:Response) : Promise<any> =>{
    try {
        const {title,description,appList} = req.body;
        //put file path here
        if ( !title || !appList.youtube || appList.youtube !== 'yes') {
            return res.status(400).json({ message: 'Missing required video data' });
        }
        const appsToPost = Object.keys(appList).filter(app=>appList[app]==='yes');
        if (appsToPost.length === 0) {
            return res.status(400).json({ message: 'At least one app must be selected for posting' });
          }
        const authenticatedApps = allowedConnector.filter(connector =>
            appsToPost.includes(connector.provider.provider_name.toLowerCase())
        );
        const notAuthenticatedApps = appsToPost.filter(app => 
            !authenticatedApps.some(authApp => authApp.provider.provider_name.toLowerCase() === app)
          );

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

    } catch (error) {
        res.status(500).json({ message: 'An error occurred while posting' });
    }
})






export default dashboard;