
import passport from "passport";
import {Strategy as GoogleStrategy, Profile, VerifyCallback} from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID!,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:process.env.GOOGLE_REDIRECT_URI,
    scope:['email','profile'],
    accessType: 'offline',
    prompt:'consent'
}as any,async (accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback)=>{
    console.log('accessTokeforuser',accessToken)
    console.log('refreshToken',refreshToken);

    done(null,{
        username : profile.displayName,
        accessToken,
        refreshToken
    })
}))
passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });