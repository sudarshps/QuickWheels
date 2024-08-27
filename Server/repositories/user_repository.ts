import User,{IUser} from '../models/user_model'


class UserRepository {

    async createUser(userData:Partial<IUser>): Promise<IUser>{
        
        const user = new User(userData)
        
        return await user.save();
    }
    async findUserByEmail(email:string):Promise<IUser | null>{
        return await User.findOne({email}).exec()
    }

    async validateUser(userData:Partial<IUser>):Promise<IUser | null>{
        
        return await User.findOne({email:userData.email,password:userData.password})

    }

}


export default new UserRepository()