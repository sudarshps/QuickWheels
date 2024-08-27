import {Request,Response} from 'express'
import UserService from '../services/user_service'
import { IUser } from '../models/user_model' 


class UserController {

        async createUser(req:Request,res:Response):Promise<void> {
            try {
                const{userName,password,email} = req.body
                
                const createUser = await UserService.createUser({name:userName,password,email})
                res.json(createUser)
            } catch (error) {
                console.error('error in creating user')
            }
        }


        async checkUserMail(req:Request,res:Response): Promise<void> {
            try {
                
                const {email} = req.body
                const validate = await UserService.validateEmail({email})

                res.status(200).json(validate)
            } catch (error) {
                console.error('Error in mail checking',error)
                res.status(500).json({message:'Internal Server Error'})
            }
        }

        async userLogin(req:Request,res:Response): Promise<void> {
            try {
                
                const{email,password} = req.body
                const validate = await UserService.validateUser({email,password})

                res.status(200).json(validate)
            } catch (error) {
                console.error('error in logging user',error)
                res.status(500).json({message:'Internal Server Error'})
            }
        }

}

export default new UserController()