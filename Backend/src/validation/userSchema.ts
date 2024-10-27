import zod from 'zod';

//user registration signIn v

export const userSignupSchema = zod.object({
    username :  zod.string().min(3).max(20),
    email : zod.string().email(),
    password : zod.string().min(6)
})

export const userSigninSchema = zod.object({
    username :  zod.string().min(3).max(20),
    password : zod.string().min(6)
})