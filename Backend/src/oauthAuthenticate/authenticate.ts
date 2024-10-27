import express, { Request, Response } from 'express';
import authenticateJWT from '../validation/routeAuthenticate';
import passport from 'passport';
const authrouter =  express.Router();
authrouter.get('/google',passport.authenticate('google'),(req,res)=>{
    console.log(res);
    res.send("inside auth route")
})
authrouter.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',        // Redirect to homepage or error page if authentication fails
        successRedirect: '/dashboard' // Redirect to dashboard or desired page upon successful authentication
    }),
    (req, res) => {
        // This callback is optional as redirection is handled by the options above
        res.send('Authentication successful!');
    }
);




export default authrouter;