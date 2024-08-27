import userRepository from "../repositories/user_repository"
import { IUser } from "../models/user_model"


interface EmailValidate {
    emailExists: boolean;
    message?: string;
}

interface UserResponse {
    userCreated: boolean;
    message?:string;
}

interface userValidate {
    validUser: boolean;
    username:string;
    message?:string;
}

class UserService{

    async createUser(userData:Partial<IUser>): Promise<UserResponse> {
        const user = await userRepository.createUser(userData)
        
        if(user){
            return{
                userCreated:true,
                message:'User registered successfully'
            }
        }

        return{
            userCreated:false,
            message:'User registration failed'
        }
    }



    async validateEmail(userData: Partial<IUser>): Promise<EmailValidate> {
        const existingUser = await userRepository.findUserByEmail(userData.email as string)
        if(existingUser){
            return{
                emailExists:true,
                message:'Email is already registered'
            }
        }

        return{
            emailExists:false,
            message:'Email is not registered'
        }
    }


    async validateUser(userData: Partial<IUser>): Promise<userValidate> {
        const validUser = await userRepository.validateUser(userData)
        if(validUser){
            return{
                validUser: true,
                username:validUser.name,
                message:'User is vaild'
            }
        }

        return{
            validUser:false,
            username:'',
            message:'User is invalid'
        }
    }
}


export default new UserService()