import {Request,Response} from 'express'
import passportAuth from '../config/passport'
import session from 'express-session'

interface AuthenticatedRequest extends Request {
    user?: {
        email?:string;
        displayName?:string
    }
}

declare module 'express-session' {
    interface Session {
        username?: string
    }
}

export const googleAuth = passportAuth.authenticate('google', { scope: ['email', 'profile'] });

export const googleAuthCallback = passportAuth.authenticate('google', {
    successRedirect: '/auth/callback/success',
    failureRedirect: '/auth/callback/failure'
});

export const authSuccess = (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        return res.redirect('/auth/callback/failure');
    }
    const username = req.user.displayName
    req.session.username = username
    res.redirect(`http://localhost:5173/?username=${encodeURIComponent(username as string)}`);
};


export const authFailure = (req: Request, res: Response) => {
    res.send("Error");
};



