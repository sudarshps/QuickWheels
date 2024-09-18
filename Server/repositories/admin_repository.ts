import User,{IUser} from "../models/user_model"


class AdminRepository {
    async getUsers():Promise<IUser[] | null>{
        return await User.find()
    }

    async userDetails(id:string):Promise<IUser | null> {
        return await User.findById(id)
    }

    async verifyUser(status:string,id:string,isVerified:boolean):Promise<string | undefined> {        
        const response =  await User.findByIdAndUpdate(id,{status:status,isVerified:isVerified})
        return response?.status
        
    }
}

export default new AdminRepository()