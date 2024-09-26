import {Request,Response} from 'express'
import AdminService from '../services/admin_service'


class AdminController {
    async getUserList(req:Request,res:Response):Promise<void> {
        try {
            const getUsers = await AdminService.getUsers()
            res.json(getUsers)
        } catch (error) {
            console.error('error in getting user list',error)
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

    async getHostDetails(req:Request,res:Response):Promise<void>{
        try {
            const {id} = req.query
            if(!id){
                res.status(400).json({message:"ID parameter is missing"})
                return
            }
            const getHostDetails = await AdminService.hostDetails(id as string)
            
            res.json(getHostDetails)
        } catch (error) {
            console.error('error in fetching host details',error);
            
        }
    }


    async getHostList(req:Request,res:Response):Promise<void> {
        try {
            const getHosts = await AdminService.hostList()
            res.json(getHosts)
        } catch (error) {
            console.error('error in fetching host list',error);
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

    async verifyHost(req:Request,res:Response):Promise<void> {
        try {
            const{hostStatus,id} = req.body
            
            const response = await AdminService.verifyHost(hostStatus,id)
            res.json(response)
        } catch (error) {
            console.error('error in verifying host',error);
        }
    }
}


export default new AdminController()