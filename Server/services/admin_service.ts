import adminRepository from '../repositories/admin_repository'
import {IUser} from '../models/user_model'
import { signAccessToken } from '../utils/jwt_utils';

interface AdminValidation {
    validated:boolean;
    accessToken?:string;
    message:string
}

interface UserVerification {
    statusUpdated:boolean;
    message:string
}

class AdminService {
    async getUsers():Promise<IUser[] | null> {
        return await adminRepository.getUsers()
    }

    async userDetails(id:string):Promise<IUser | null> {
        return await adminRepository.userDetails(id)
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

}


export default new AdminService()