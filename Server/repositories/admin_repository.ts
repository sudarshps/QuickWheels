import User, { IUser } from "../models/user_model";
import CarModel, { ICar } from "../models/car_model";

interface ICarWithUserDetails extends ICar {
    userDetails:IUser
}

class AdminRepository {
  async getUsers(): Promise<IUser[] | null> {
    return await User.find();
  }

  async getHosts(): Promise<ICarWithUserDetails[] | null> {
    return await CarModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
    ]);
  }

  async userDetails(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async hostDetails(id:string):Promise<ICar | null> {
    return await CarModel.findById(id)
  }

  async verifyUser(
    status: string,
    id: string,
    isVerified: boolean
  ): Promise<string | undefined> {
    const response = await User.findByIdAndUpdate(id, {
      status: status,
      isVerified: isVerified,
    });
    return response?.status;
  }

  async verifyHost(
    status:string,
    id:string,
    isVerified:boolean
  ): Promise<string | undefined> {
    const response = await CarModel.findByIdAndUpdate(id, {
        status:status,
        isVerified:isVerified
    })
    return response?.status
  }
}

export default new AdminRepository();
