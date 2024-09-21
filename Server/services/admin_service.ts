import adminRepository from '../repositories/admin_repository'
import {IUser} from '../models/user_model'
import { signAccessToken } from '../utils/jwt_utils';
import { ICar } from '../models/car_model';
import { Types } from 'mongoose';

interface AdminValidation {
    validated:boolean;
    accessToken?:string;
    message:string
}

interface UserVerification {
    statusUpdated:boolean;
    message:string
}

interface HostDetails {
    _id:Types.ObjectId;
    hostName:string;
    email:string;
    carModel:string;
    dob:string;
    status:string;
}

class AdminService {
    async getUsers():Promise<IUser[] | null> {
        return await adminRepository.getUsers()
    }

    async hostList():Promise<HostDetails[] | null> {
        const hostDetails = await adminRepository.getHosts()
        if(!hostDetails){
            return null
        }
        return hostDetails
        .filter((host)=>host.userDetails.isHost)
        .map((host)=>({
            _id:host._id,
            hostName:host.userDetails.name,
            email:host.userDetails.email,
            carModel:host.carModel,
            dob:host.userDetails.dob,
            status:host.status
        }))
    }   

    async userDetails(id:string):Promise<IUser | null> {
        return await adminRepository.userDetails(id)
    }

    async hostDetails(id:string):Promise<ICar | null> {
        return await adminRepository.hostDetails(id)
    }

    async login(email:string,password:string):Promise<AdminValidation> {
            const adminMail = process.env.ADMIN_EMAIL
            const adminPass = process.env.ADMIN_PASS

            if(email===adminMail && password===adminPass){
                const accessToken = signAccessToken({adminmail:adminMail})
                return{
                    validated:true,
                    accessToken:accessToken,
                    message:'admin validation successful'
                }
            }

            return{
                validated:false,
                message:'admin validation failed'
            }
    }

    async verifyUser(status:string,id:string):Promise<UserVerification> {
        let isVerified = false
        if(status==='Verified'){
            isVerified = true
        }
        const response = await adminRepository.verifyUser(status,id,isVerified)
        
        if(response === 'Verified'){
            return{
                statusUpdated:true,
                message:'status updated'
            }
        }

        return{
            statusUpdated:false,
            message:'status updated'
        }
       
    }

    async verifyHost(status:string,id:string):Promise<UserVerification> {
        let isVerified = false
        if(status==='Verified'){
            isVerified = true
        }
        console.log('again',isVerified);
        
        const response = await adminRepository.verifyHost(status,id,isVerified)
        
        if(response === 'Verified'){
            return{
                statusUpdated:true,
                message:'status updated'
            }
        }

        return{
            statusUpdated:false,
            message:'status updated'
        }
    }

}


export default new AdminService()