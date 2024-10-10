import adminRepository from "../repositories/admin_repository";
import { IUser } from "../models/user_model";
import { signAccessToken } from "../utils/jwt_utils";
import { ICar } from "../models/car_model";
import { Types } from "mongoose";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ICarMakeCategory } from "../models/carmake-category_model";
import { ICarTypeCategory } from "../models/cartype-category_model";

interface AdminValidation {
  validated: boolean;
  accessToken?: string;
  message: string;
}

interface UserVerification {
  statusUpdated: boolean;
  message: string;
}

interface CategoryResponseType {
  categoryAdded: boolean;
  message: string;
}

interface CategoryRemoveType {
  categoryRemoved: boolean;
  message: string;
}

interface HostDetails {
  _id: Types.ObjectId;
  hostName: string;
  email: string;
  carModel: string;
  dob: string;
  status: string;
}


class AdminService {
  async getUsers(): Promise<IUser[] | null> {
    return await adminRepository.getUsers();
  }

  async hostList(): Promise<HostDetails[] | null> {
    const hostDetails = await adminRepository.getHosts();
    if (!hostDetails) {
      return null;
    }    
    return hostDetails
      .filter((host) => host.userDetails.isHost)
      .map((host) => ({
        _id: host._id,
        
        userId:host.userDetails._id,
        hostName: host.userDetails.name,
        email: host.userDetails.email,
        carModel: host.carModel,
        dob: host.userDetails.dob,
        isActive:host.isActive,
        status: host.status,
      }));
  }

  async userDetails(id: string): Promise<IUser | null> {
    return await adminRepository.userDetails(id);
  }

  async hostDetails(id: string): Promise<ICar | null> {
    return await adminRepository.hostDetails(id);
  }

  async login(email: string, password: string): Promise<AdminValidation> {
    const adminMail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASS;
    const accessSecret = process.env.JWT_ACCESS_SECRET;

    if (email === adminMail && password === adminPass) {
      const accessToken = (options?: SignOptions): string => {
        return jwt.sign({ adminmail: adminMail }, accessSecret as string, {
          ...(options && options),
        });
      };
      return {
        validated: true,
        accessToken: accessToken(),
        message: "admin validation successful",
      };
    }

    return {
      validated: false,
      message: "admin validation failed",
    };
  }

  async verifyUser(
    status: string,
    id: string,
    note: string
  ): Promise<UserVerification> {
    let isVerified = false;
    if (status === "Verified") {
      isVerified = true;
    }
    const response = await adminRepository.verifyUser(
      status,
      id,
      isVerified,
      note
    );

    if (response === "Verified") {
      return {
        statusUpdated: true,
        message: "status updated",
      };
    }

    return {
      statusUpdated: false,
      message: "status updated",
    };
  }

  async verifyHost(
    status: string,
    id: string,
    note: string
  ): Promise<UserVerification> {
    let isVerified = false;
    if (status === "Verified") {
      isVerified = true;
    }
    const response = await adminRepository.verifyHost(
      status,
      id,
      isVerified,
      note
    );

    if (response === "Verified") {
      return {
        statusUpdated: true,
        message: "status updated",
      };
    }

    return {
      statusUpdated: false,
      message: "status updated",
    };
  }

  async addTypeCategory(newCategory: string): Promise<CategoryResponseType> {
    const response = await adminRepository.addTypeCategory(newCategory);
    if (!response) {
      return {
        categoryAdded: false,
        message: "Category was not added",
      };
    }
    return {
      categoryAdded: true,
      message: "category added successfully",
    };
  }

  async addMakeCategory(newCategory: string): Promise<CategoryResponseType> {
    const response = await adminRepository.addMakeCategory(newCategory);
    if (!response) {
      return {
        categoryAdded: false,
        message: "Category was not added",
      };
    }
    return {
      categoryAdded: true,
      message: "category added successfully",
    };
  }

  async makeCategory(): Promise<ICarMakeCategory[]> {
    return await adminRepository.makeCategory();
  }

  async typeCategory(): Promise<ICarTypeCategory[]> {
    return await adminRepository.typeCategory();
  }

  async removeMakeCategory(categoryId: string): Promise<ICarMakeCategory | undefined> {
    if (typeof categoryId === "string") {
      return await adminRepository.removeMakeCategory(categoryId);
      
    }
  }

  async removeTypeCategory(categoryId: string): Promise<ICarMakeCategory | undefined> {
    if (typeof categoryId === "string") {
      return await adminRepository.removeTypeCategory(categoryId);
    }
  }

  async updateMakeCategory(newCategory:string,categoryId:string): Promise<ICarMakeCategory | undefined | null> {
    if(typeof categoryId === "string"){
      return await adminRepository.updateMakeCategory(newCategory,categoryId)
    }
  }

  async updateTypeCategory(newCategory:string,categoryId:string): Promise<ICarTypeCategory | undefined | null> {
    if(typeof categoryId === "string"){
      return await adminRepository.updateTypeCategory(newCategory,categoryId)
    }
  }

  async userStatus(status:boolean,userId:string):Promise<UserVerification | null> {
    const response = await adminRepository.userStatus(status,userId)
    if(!response){
      return{
        statusUpdated:false,
        message:'status was not updated'
      }
    }
    return{
      statusUpdated:true,
      message:'status updated'
    }
  }

  async hostStatus(status:boolean,hostId:string,carId:string):Promise<UserVerification | null> {
    const response = await adminRepository.hostStatus(status,hostId,carId)
    if(!response){
      return{
        statusUpdated:false,
        message:'status was not updated'
      }
    }
    return{
      statusUpdated:true,
      message:'status updated'
    }
  }
}

export default new AdminService();
