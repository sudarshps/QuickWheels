import userRepository from "../repositories/user_repository"
import { IUser } from "../models/user_model"
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt'
import {signAccessToken, signRefreshToken} from '../utils/jwt_utils'

interface EmailValidate {
    emailExists: boolean;
    token?:string;
    message?: string;
}

interface UserResponse {
    userCreated: boolean;
    userId?:ObjectId;
    accessToken?:string;
    message?:string;
}

interface UserUpdateResponse {
    userUpdated: boolean;
    email?:string,
    isHost?:boolean,
    userName?:string,
    profileUpdated?:boolean;
    message?:string;
}

interface CarDetailsResponse {
    updatedCarDetails: boolean;
    message?:string;
}

interface CarDetails{
    carDetails:boolean;
    model?:string,
    registerNumber?:string;
    insuranceExp?:string;
    images?:string[];
    message:string;

}

interface userValidate {
    validUser: boolean;
    username:string;
    accessToken?:string;
    refreshToken?:string;
    userId?:ObjectId;
    profileUpdated?:boolean;
    isHost?:boolean;
    status?:string
    message?:string;
}

interface UserDetails {
    dob:string;
    phone:string;
    address:string;
    drivingExpDate:string;
    drivingID:string;
    drivingIDFront:string;
    drivingIDBack:String;
    profileUpdated:boolean;
    isHost:boolean;
    status:string;
}

class UserService{

    async createUser(userData:Partial<IUser>): Promise<UserResponse> {
        const hashedPassword = await bcrypt.hash(userData.password as string,10)
        userData.password = hashedPassword
        const user = await userRepository.createUser(userData)
        
        if(user){
            // const accesstoken = signAccessToken({id:user._id,email:user.email})
            // const refreshToken = signRefreshToken({id:user._id,email:user.email})
            return{
                userCreated:true,
                userId:user._id,
                // accessToken:accesstoken,
                message:'User registered successfully'
            }
        }

        return{
            userCreated:false,
            message:'User registration failed'
        }
    }


    async userProfile(userData:Partial<IUser>): Promise<UserUpdateResponse> {
        const user = await userRepository.updateUserProfile(userData)
        
        if(user){
            
            return{
                userUpdated:true,
                userName:user.name,
                email:user.email,
                isHost:Boolean(user.isHost),
                profileUpdated:Boolean(user.profileUpdated),
                message:'User updated successfully'
            }
        }

        return{
            userUpdated:false,
            message:'User updation failed'
        }
    }



    async validateEmail(userData: Partial<IUser>): Promise<EmailValidate> {
        const user = await userRepository.findUserByEmail(userData.email as string)
        if(user){
            // const token = signAccessToken({id:user._id,email:user.email})
            return{
                emailExists:true,
                // token:token,
                message:'Email is already registered'
            }
        }

        return{
            emailExists:false,
            message:'Email is not registered'
        }
    }


    async validateUser(userData: Partial<IUser>): Promise<userValidate> {
        const user = await userRepository.validateUser(userData)        
        if(user){
            const isMatch = await bcrypt.compare(userData.password as string,user.password)
            if(isMatch){
                
                const accessToken = signAccessToken({id:user._id,username:user.name,email:user.email,profileUpdated:user.profileUpdated,isHost:user.isHost})
                const refreshToken = signRefreshToken({id:user._id,username:user.name,email:user.email,profileUpdated:user.profileUpdated,isHost:user.isHost})
                return{
                    validUser: true,
                    username:user.name,
                    userId:user._id,
                    accessToken:accessToken,
                    refreshToken:refreshToken,
                    profileUpdated:Boolean(user.profileUpdated),
                    isHost:Boolean(user.isHost),
                    status:user.status,
                    message:'User validation is successful'
                }
            }
        }
        
        return{
            validUser:false,
            username:'',
            message:'Incorrect Password'
        }
    }


    async userDetails(email:string):Promise<UserDetails | void> {
        const user = await userRepository.findUserByEmail(email)
        if(user){
            return {
                dob:user.dob,
                phone:user.phone,
                address:user.address,
                drivingExpDate:user.drivingExpDate,
                drivingID:user.drivingID,
                drivingIDFront:user.drivingIDFront,
                drivingIDBack:user.drivingIDBack,
                profileUpdated:Boolean(user.profileUpdated),
                isHost:Boolean(user.isHost),
                status:user.status
            }
        }

    }



    async carDetails(email:string,carData:object,isVerified:boolean,status:string):Promise<CarDetailsResponse> {
        
        const carDetails = await userRepository.carDetails(email,carData,isVerified,status)

        if(carDetails){
            return{
                updatedCarDetails:true,
                message:'Car Details Created'
            }
        }

        return{
            updatedCarDetails:false,
            message:'Car Details Creation failed'
        }
        
    }


    async getCarDetails(email:string):Promise<CarDetails> {
        
        const carDetails = await userRepository.getCarDetails(email)

        if(carDetails){
            return{
                carDetails:true,
                model:carDetails.carModel,
                registerNumber:carDetails.registerNumber,
                insuranceExp:carDetails.insuranceExp,
                images:carDetails.images,
                message:'Car Details Created'
            }
        }

        return{
            carDetails:false,
            message:'Car Details Creation failed'
        }
        
    }



}


export default new UserService()