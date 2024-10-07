import { Request, Response, NextFunction } from 'express';
import { verifyToken,renewToken } from '../utils/jwt_utils';

export interface AuthRequest extends Request {
    user?: string | object | boolean;
}

const verifyUser = (req: AuthRequest, res: Response, next: NextFunction):Object | void => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
        
    if(accessToken){
        const decoded = verifyToken(accessToken)
        if(decoded){            
            req.user = decoded
            return next()
        }else{
            return res.status(403).json({message:'Invalid access token'})
        }
    }

    if(!accessToken && refreshToken){
        const renewedToken = renewToken(req,res)
        if(renewedToken){
            return next()
        }else{
            return res.status(403).json({message:'Invalid refresh token'})
        }
    }
    if(!accessToken && !refreshToken){
        return res.json({message:'Authorization failed'})
    }  
        
    }

   

export default verifyUser;