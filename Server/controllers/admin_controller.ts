import {Request,Response} from 'express'
import AdminService from '../services/admin_service'


class AdminController {
    async getUserList(req:Request,res:Response):Promise<void> {
        try {
            const getUsers = await AdminService.getUsers()
            res.json(getUsers)
        } catch (error) {
            console.error('error in getting user list')
        }
    }

    async getUserDetails(req:Request,res:Response):Promise<void> {
        try {
            const {id} = req.query
            if(!id){
                res.status(400).json({ message: "ID parameter is missing" });
                return;
            }
            const getUserDetails = await AdminService.userDetails(id as string)
            res.json(getUserDetails)
            
        } catch (error) {
            console.error('error getting user details',error)
        }
    }

    async login(req:Request,res:Response):Promise<void> {
        try {
            
            const {email,password} = req.body
            const validate = await AdminService.login(email,password)
            if(validate.validated){
                const accessToken = validate.accessToken as string
                res.cookie('adminAccessToken', accessToken, {
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'none', 
                    maxAge: 1800000 
                });
                res.json(validate)

            }else{
                res.json(validate)
            }

        } catch (error) {
            console.error('error in admin log in',error)
        }
    }

    async verifyUser(req:Request,res:Response):Promise<void> {
        try {
            const{userStatus,id} = req.body
            
            const response = await AdminService.verifyUser(userStatus,id)
            res.json(response)
        } catch (error) {
            console.error('error in verifying user',error);
            
        }
    }
}


export default new AdminController()