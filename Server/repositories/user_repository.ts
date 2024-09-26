import User,{IUser} from '../models/user_model'
import CarModel,{ICar} from '../models/car_model'


interface UserAddress {
    address:string,
    location:{
        type:string,
        coordinates:[number,number]
    }
}

interface ICarWithAddress extends ICar{
    userAddress:UserAddress;
}

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

    async updateUserProfile(userData:Partial<IUser>,longitude:number,latitude:number):Promise<IUser | null>{
        const email = userData.email
        return await User.findOneAndUpdate({email},{$set:{...userData,'location':{type:'Point',coordinates:[longitude,latitude]}}})
    }

    async carDetails(email:string,carData:object,isVerified:boolean,status:string):Promise<ICar | null>{
        
        try {
            const user = await User.findOne({email})

            if(user){
                const newCar = new CarModel({
                    ...carData,
                    userId:user._id,
                    address:user.address,
                    location:user.location,
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

    async getRentCarDetails():Promise<ICarWithAddress[] | null> {
        return await CarModel.find({isVerified:1})
    }

    async userCarDetails(id:string):Promise<ICar | null> {
        return await CarModel.findById(id)
    }

    async getUserDetails(id:string):Promise<IUser | null> {
        return await User.findById(id)
    }

    async getCarDistance(lng:number,lat:number,distanceValue:number):Promise<ICarWithAddress[] | null>{
    const geoNearStage:any = {
        $geoNear:{
            near:{type:"Point",coordinates:[lng,lat]},
            distanceField:"distance",
            spherical:true
        }
    }

    if(distanceValue!==0){
        geoNearStage.$geoNear.maxDistance = distanceValue*1000
    }

    return await CarModel.aggregate([geoNearStage])
}
 
}


export default new UserRepository()