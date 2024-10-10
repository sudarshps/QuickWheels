import jwt,{JwtPayload,SignOptions} from 'jsonwebtoken'
import dotenv from 'dotenv'
import { Request,Response } from 'express'
dotenv.config()

const accessSecret = process.env.JWT_ACCESS_SECRET
const refreshSecret = process.env.JWT_REFRESH_SECRET

export const signAccessToken = (payload:object,options?:SignOptions): string => {
    return jwt.sign(payload,accessSecret as string,{...(options && options),expiresIn:'30m'})
}


export const signRefreshToken = (payload:object,options?:SignOptions): string => {
    return jwt.sign(payload,refreshSecret as string,{...(options && options),expiresIn:'5h'})
}

export const verifyToken = (token:string): JwtPayload | void => {
    try {
        return jwt.verify(token,accessSecret as string) as JwtPayload
    } catch (error) {
        
    }
}

export const renewToken = (req:Request,res:Response):string | null => {
    const refreshToken = req.cookies.refreshToken

    try {
        const decoded = jwt.verify(refreshToken,refreshSecret as string) as JwtPayload
        
        const {exp,...payload} = decoded
        if(payload){
            const newAccessToken = signAccessToken(payload)
            res.cookie('accessToken',newAccessToken,{
                maxAge:1800000,
                httpOnly:true,
                secure:process.env.NODE_ENV !== 'development',
                sameSite:'strict'
            })
            req.user = payload
            // return true
            return newAccessToken

        }        
    } catch (error) {
        console.error('error verifying refresh token',error)
    }
    
    return null
}