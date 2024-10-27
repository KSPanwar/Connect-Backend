import express from 'express';
import passport from 'passport';
import router from './Routes/user';
import './config'
import cookieParser from 'cookie-parser';
import dashboard from './dashboard/dashboard';
import authrouter from './oauthAuthenticate/authenticate';
import session from 'express-session';

require('./Strategies/google')
const app = express();
const PORT = process.env.PORT|| 3001;

app.use(
    session({
      secret: process.env.SESSION_SECRET!,     // Replace with a secure secret in production
      resave: false,                 // Don't resave session if it hasn't changed
      saveUninitialized: false,      // Only save sessions when initialized with data
      cookie: { secure: false }      // Set to true if using HTTPS in production
    })
  );

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());
app.use('/user',router);
app.use('/dashboard',dashboard);
app.use('/auth',authrouter);

app.get('/',(req,res)=>{
    res.send('Hello World! failure homepage');
})

app.listen(PORT,()=>{
    console.log(`Running on Server ${PORT}`);
})