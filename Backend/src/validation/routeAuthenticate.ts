import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT authentication middleware
function authenticateJWT(req: Request, res: Response, next: NextFunction) :void{
    console.log(req.headers)
    if (!req.cookies || !req.cookies.token) {
        res.status(400).json({ message: 'Please set cookie' });
        return 
    }
    const token = req.cookies.token; // Retrieve token from cookies
    console.log('cookies' +req.cookies)
    if (!token) {
     res.status(403).json({ message: 'Access denied. No token provided.' });
     return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err :any, decoded :any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log(jwt.decode(token));
        req.userId = decoded.userId;
        console.log('In middleware routes'+ decoded);// Attach decoded token to request (user info)
        next(); // Proceed to the next middleware or route handler
    });
}

export default authenticateJWT;