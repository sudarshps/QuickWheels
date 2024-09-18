import User,{IUser} from '../models/user_model'
import CarModel,{ICar} from '../models/car_model'


class UserRepository {

    async createUser(userData:Partial<IUser>): Promise<IUser>{
        
        const user = new User(userData)
        
        return await user.save();
    }
    async findUserByEmail(email:string):Promise<IUser | null>{
        return await User.findOne({email}).exec()
    }

    async validateUser(userData:Partial<IUser>):Promise<IUser | null>{
        return await User.findOne({email:userData.email})
    }

    async updateUserProfile(userData:Partial<IUser>):Promise<IUser | null>{
        const email = userData.email
        return await User.findOneAndUpdate({email},userData)
    }

    async carDetails(email:string,carData:object,isVerified:boolean,status:string):Promise<ICar | null>{
        
        try {
            const user = await User.findOne({email})

            if(user){
                const newCar = new CarModel({
                    ...carData,
                    userId:user._id,
                    isVerified,
                    status
                })

                const response = await newCar.save()
                if(response){
                   await User.findByIdAndUpdate({_id:user._id},{isHost:true})
                   return response
                }
            }

            return null

            
        } catch (error) {
            console.error('Error in creating car document',error)

            return null
        }
 
    }

    async getCarDetails(email:string):Promise<ICar | null> {
        try {
            const user = await User.findOne({email})
            if (!user) {
                console.error('User not found with the provided email:', email);
                return null;
              }
          
              const carDetails = await CarModel.findOne({ userId: user._id });
              
              if (!carDetails) {
                console.error('Car details not found for user:', user._id);
                return null;
              }
          
              return carDetails;
        } catch (error) {
            console.error('error fetching car details',error)
            return null
        }
    }

    

}


export default new UserRepository()