import express, { Request, Response } from 'express';
import { userSigninSchema, userSignupSchema } from '../validation/userSchema';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import authenticateJWT from '../validation/routeAuthenticate';
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const router =  express.Router();


router.get('/protected', authenticateJWT, (req: Request, res: Response) => {
    res.status(200).json({ message: `Hello, user}!` });
});

//Sign-in route
router.post('/signin', async (req: Request, res: Response): Promise<any> => {
    try {
        const userData = userSigninSchema.parse(req.body);
        if (!userData) {
            return res.status(400).json({ message:"Invalid Inputs" });
        }
        const { username, password } = userData;
        const existingUser = await prisma.user.findUnique({
            where: { userName:username },
        });
        if (!existingUser) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);
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
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});

router.post('/signup', async (req: Request, res: Response): Promise<any> => { 
    try {
        const userData = userSignupSchema.parse(req.body);
        const { email, password, username } = userData;

        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists!' });
        }
        const existingUserName = await prisma.user.findUnique({
            where: { userName:username},
        });
        if(existingUserName){
            return res.status(400).json({ message: 'UserName is already takem' });
        }


        const saltRounds = parseInt(process.env.SALT_ROUNDS || '10', 10);
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password_hash: hashedPassword,
                userName: username, // Include username if needed
            },
        });

        return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(400).json({ error: error instanceof Error ? error.message : 'An error occurred' });
    }
});


export default router;
