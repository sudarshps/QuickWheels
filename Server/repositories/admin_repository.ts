import User, { IUser } from "../models/user_model";
import CarModel, { ICar } from "../models/car_model";
import CarType, { ICarTypeCategory } from "../models/cartype-category_model";
import CarMake, { ICarMakeCategory } from "../models/carmake-category_model";
import { Types } from "mongoose";
import OrderModel, { IOrder } from "../models/orders";
import { populate } from "dotenv";

interface ICarWithUserDetails extends ICar {
  userDetails: IUser;
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

  async hostDetails(id: string): Promise<ICar | null> {
    const hostId = new Types.ObjectId(id);
    const result = await CarModel.aggregate([
      { $match: { _id: hostId } },
      {
        $lookup: {
          from: "carmakes",
          localField: "make",
          foreignField: "_id",
          as: "carMake",
        },
      },
      {
        $lookup: {
          from: "cartypes",
          localField: "carType",
          foreignField: "_id",
          as: "carType",
        },
      },
    ]);
    return result.length > 0 ? (result[0] as ICar) : null;
  }

  async verifyUser(
    status: string,
    id: string,
    isVerified: boolean,
    note: string
  ): Promise<string | undefined> {
    const response = await User.findByIdAndUpdate(id, {
      status: status,
      isVerified: isVerified,
      note: note,
    });
    return response?.status;
  }

  async verifyHost(
    status: string,
    id: string,
    isVerified: boolean,
    note: string
  ): Promise<string | undefined> {
    const response = await CarModel.findByIdAndUpdate(id, {
      status: status,
      isVerified: isVerified,
      note: note,
    });
    return response?.status;
  }

  async findTypeCategory(
    newCategory: string
  ): Promise<ICarTypeCategory | null> {
    return await CarType.findOne({ name: newCategory });
  }

  async addTypeCategory(newCategory: string): Promise<ICarTypeCategory> {
    const carType = new CarType({ name: newCategory });

    return await carType.save();
  }

  async findMakeCategory(
    newCategory: string
  ): Promise<ICarMakeCategory | null> {
    return await CarMake.findOne({ name: newCategory });
  }

  async addMakeCategory(newCategory: string): Promise<ICarMakeCategory> {
    const carType = new CarMake({ name: newCategory });

    return await carType.save();
  }

  async makeCategory(): Promise<ICarMakeCategory[]> {
    return await CarMake.find();
  }

  async typeCategory(): Promise<ICarTypeCategory[]> {
    return await CarType.find();
  }

  async removeMakeCategory(categoryId: string): Promise<any> {
    return await CarMake.findByIdAndDelete(categoryId);
  }

  async removeTypeCategory(categoryId: string): Promise<any> {
    return await CarType.findByIdAndDelete(categoryId);
  }

  async updateMakeCategory(
    newCategory: string,
    categoryId: string
  ): Promise<ICarMakeCategory | null> {
    return await CarMake.findByIdAndUpdate(categoryId, { name: newCategory });
  }

  async updateTypeCategory(
    newCategory: string,
    categoryId: string
  ): Promise<ICarTypeCategory | null> {
    return await CarType.findByIdAndUpdate(categoryId, { name: newCategory });
  }

  async userStatus(status: boolean, userId: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { isActive: status });
  }

  async hostStatus(
    status: boolean,
    hostId: string,
    carId: string
  ): Promise<IUser | ICar | null> {
    const response = await CarModel.findByIdAndUpdate(carId, {
      isActive: status,
    });
    if (response) {
      const user = await User.findById(hostId);
      if (user?.isActive !== status) {
        return await User.findByIdAndUpdate(hostId, { isActive: status });
      }
    }
    return response;
  }

  async getOrderList(): Promise<IOrder[]> {
    return await OrderModel.find()
      .populate("userId")
      .populate({
        path: "carId",
        populate: {
          path: "userId",
        },
      });
  }

  async getOrderDetails(id: string): Promise<IOrder | null> {
    return await OrderModel.findOne({ _id: id })
      .populate("userId")
      .populate({
        path: "carId",
        populate: [
          {
            path: "userId",
          },
          {
            path: "make", 
          },
        ],
      });
  }
}

export default new AdminRepository();
