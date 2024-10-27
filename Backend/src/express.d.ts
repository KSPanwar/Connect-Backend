import { Request } from 'express';

declare module 'express' {
    export interface Request {
        userId?: string; // Add userId as optional, since it may not always be present
    }
}