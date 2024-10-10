import { Request, Response, NextFunction } from 'express';
import { verifyToken,renewToken } from '../utils/jwt_utils';
import User from '../models/user_model';

export interface AuthRequest extends Request {
    user?: string | object | boolean;
}

const verifyUser = async(req: AuthRequest, res: Response, next: NextFunction):Promise<Object | void> => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
        
    if(accessToken){
        const decoded = verifyToken(accessToken)
        const user = await User.findById(decoded?.id)
        if(decoded){      
            req.user = decoded
            if(!user?.isActive){
                res.clearCookie('accessToken')
                res.clearCookie('refreshToken')
                return res.status(403).json({isActive:false,message:'Your account blocked'})
            }
            return next()
        }else{
            return res.status(403).json({message:'Invalid access token'})
        }
    }

    if(!accessToken && refreshToken){
        const renewedToken = renewToken(req,res)
        if(renewedToken){
            const decoded = verifyToken(renewedToken)
            if(decoded){
                req.user = decoded
                return next()

            }else{
                return res.status(403).json({ message: 'Invalid access token after renewal' });
            }
        }else{
            return res.status(403).json({message:'Invalid refresh token'})
        }
    }
    if(!accessToken && !refreshToken){
        return res.json({message:'Authorization failed'})
    }  
        
    }

   

export default verifyUser;