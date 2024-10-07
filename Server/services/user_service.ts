import userRepository from "../repositories/user_repository";
import { IUser } from "../models/user_model";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/jwt_utils";
import { ICar } from "../models/car_model";
import { ICarMakeCategory } from "../models/carmake-category_model";
import { ICarTypeCategory } from "../models/cartype-category_model";

interface EmailValidate {
  emailExists: boolean;
  token?: string;
  message?: string;
}

interface UserResponse {
  userCreated: boolean;
  userId?: ObjectId;
  accessToken?: string;
  message?: string;
}

interface UserUpdateResponse {
  userUpdated: boolean;
  email?: string;
  isHost?: boolean;
  userName?: string;
  profileUpdated?: boolean;
  message?: string;
}

interface CarDetailsResponse {
  updatedCarDetails: boolean;
  message?: string;
}

interface CarDetails {
  carDetails: boolean;
  id?:ObjectId;
  model?: string;
  registerNumber?: string;
  insuranceExp?: string;
  images?: string[];
  status?: string;
  note?: string;
  dateFrom?:Date,
  dateTo?:Date,
  message: string;
}

interface userValidate {
  validUser: boolean;
  username: string;
  accessToken?: string;
  refreshToken?: string;
  userId?: ObjectId;
  profileUpdated?: boolean;
  isHost?: boolean;
  isVerified?:boolean;
  status?: string;
  role?: string[];
  message?: string;
}

interface UserDetails {
  id?:ObjectId;
  dob: string;
  phone: string;
  address: string;
  drivingExpDate: string;
  drivingID: string;
  drivingIDFront: string;
  drivingIDBack: String;
  profileUpdated: boolean;
  isHost: boolean;
  status: string;
  note: string;
  role: string[];
  isVerified: boolean;
}

type ICarWithHostName = ICar & {
  hostName?: string;
};

interface OrderType {
  successOrder:boolean,
  message:string
}

class UserService {
  async createUser(userData: Partial<IUser>): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password as string, 10);
    userData.password = hashedPassword;
    const user = await userRepository.createUser(userData);

    if (user) {
      // const accesstoken = signAccessToken({id:user._id,email:user.email})
      // const refreshToken = signRefreshToken({id:user._id,email:user.email})
      return {
        userCreated: true,
        userId: user._id,
        // accessToken:accesstoken,
        message: "User registered successfully",
      };
    }

    return {
      userCreated: false,
      message: "User registration failed",
    };
  }

  async userProfile(
    userData: Partial<IUser>,
    longitude: number,
    latitude: number
  ): Promise<UserUpdateResponse> {
    const user = await userRepository.updateUserProfile(
      userData,
      longitude,
      latitude
    );

    if (user) {
      return {
        userUpdated: true,
        userName: user.name,
        email: user.email,
        isHost: Boolean(user.isHost),
        profileUpdated: Boolean(user.profileUpdated),
        message: "User updated successfully",
      };
    }

    return {
      userUpdated: false,
      message: "User updation failed",
    };
  }

  async validateEmail(userData: Partial<IUser>): Promise<EmailValidate> {
    const user = await userRepository.findUserByEmail(userData.email as string);
    if (user) {
      // const token = signAccessToken({id:user._id,email:user.email})
      return {
        emailExists: true,
        // token:token,
        message: "Email is already registered",
      };
    }

    return {
      emailExists: false,
      message: "Email is not registered",
    };
  }

  async validateUser(userData: Partial<IUser>): Promise<userValidate> {
    const user = await userRepository.validateUser(userData);
    if (user) {
      const isMatch = await bcrypt.compare(
        userData.password as string,
        user.password
      );
      if (isMatch) {
        const accessToken = signAccessToken({
          id: user._id,
          username: user.name,
          email: user.email,
          profileUpdated: user.profileUpdated,
          isHost: user.isHost,
          role: user.role,
        });
        const refreshToken = signRefreshToken({
          id: user._id,
          username: user.name,
          email: user.email,
          profileUpdated: user.profileUpdated,
          isHost: user.isHost,
          role: user.role,
        });
        return {
          validUser: true,
          username: user.name,
          userId: user._id,
          isVerified: Boolean(user.isVerified),
          accessToken: accessToken,
          refreshToken: refreshToken,
          profileUpdated: Boolean(user.profileUpdated),
          isHost: Boolean(user.isHost),
          status: user.status,
          role: user.role,
          message: "User validation is successful",
        };
      }
    }

    return {
      validUser: false,
      username: "",
      message: "Incorrect Password",
    };
  }

  async userDetails(email: string): Promise<UserDetails | void> {
    const user = await userRepository.findUserByEmail(email);
    if (user) {
      return {
        id: user._id,
        dob: user.dob,
        phone: user.phone,
        address: user.address,
        drivingExpDate: user.drivingExpDate,
        drivingID: user.drivingID,
        drivingIDFront: user.drivingIDFront,
        drivingIDBack: user.drivingIDBack,
        profileUpdated: Boolean(user.profileUpdated),
        isHost: Boolean(user.isHost),
        status: user.status,
        role: user.role,
        note: user.note,
        isVerified: Boolean(user.isVerified),
      };
    }
  }

  async carDetails(
    email: string,
    carData: object,
    isVerified: boolean,
    status: string
  ): Promise<CarDetailsResponse> {
    const carDetails = await userRepository.carDetails(
      email,
      carData,
      isVerified,
      status
    );

    if (carDetails) {
      return {
        updatedCarDetails: true,
        message: "Car Details Created",
      };
    }

    return {
      updatedCarDetails: false,
      message: "Car Details Creation failed",
    };
  }

  async getCarDetails(email: string): Promise<CarDetails> {
    const carDetails = await userRepository.getCarDetails(email);

    if (carDetails) {
      return {
        carDetails: true,
        id:carDetails._id,
        model: carDetails.carModel,
        registerNumber: carDetails.registerNumber,
        insuranceExp: carDetails.insuranceExp,
        images: carDetails.images,
        status: carDetails.status,
        note: carDetails.note,
        dateFrom:carDetails.availabilityFrom,
        dateTo:carDetails.availabilityTo,
        message: "Car Details Created",
      };
    }

    return {
      carDetails: false,
      message: "Car Details Creation failed",
    };
  }

  async rentCarDetails(
    userId:string,
    sort: string,
    transmission: string[],
    fuel: string[],
    seat: string[],
    lng: number,
    lat: number,
    distanceValue: number,
    searchInput: string,
    carType: string[],
    make:string,
    dateFrom:Date | undefined,
    dateTo:Date | undefined
  ): Promise<ICar[] | null> {
    let carDetails = await userRepository.getRentCarDetails();

    if (carDetails && lng !== 0 && lat !== 0) {
      carDetails = await userRepository.getCarDistance(lng, lat, distanceValue);
    }


    if (carDetails && searchInput.trim()) {
      const regex = new RegExp(searchInput, "i");
      carDetails = carDetails?.filter((car) => {
        const carTypeName =
          typeof car.carType === "object" && "name" in car.carType
            ? car.carType.name
            : ""; 
        const carMakeName = 
          typeof car.make === 'object' && 'name' in car.make 
            ? car.make.name
            : "";    
                         
        return (
          regex.test(carMakeName) ||
          regex.test(carTypeName) ||
          regex.test(car.carModel) ||
          regex.test(car.transmission) ||
          regex.test(car.seatCapacity) ||
          regex.test(car.fuel)
        );
      });
    }

    if (!carDetails) {
      return null;
    }

    

    if(dateFrom && dateTo){
      
        carDetails = carDetails.filter((car)=>{
          const from = new Date(dateFrom)
          const to = new Date(dateTo) 
          
          return(
            from>=car.availabilityFrom && to<=car.availabilityTo
          )
        })
    }    
    
    if(userId){
      carDetails = carDetails.filter((car)=>{
        
        return(
          car.userId.toString() !== userId
        )
      })
    }

    if(make){
      carDetails = carDetails.filter((car) => {
        const carMakeName = 
        typeof car.make === 'object' && 'name' in car.make 
          ? car.make.name
          : ""; 
          return carMakeName === make
      }
      )
    }

    if (transmission && transmission.length > 0) {
      carDetails = carDetails.filter((car) =>
        transmission.includes(car.transmission)
      );
    }

    if(carType && carType.length > 0) {

      carDetails = carDetails.filter((car) =>{
        const carTypeName =
        typeof car.carType === "object" && "name" in car.carType
          ? car.carType.name
          : "";           
        return carType.includes(carTypeName)
      })
    }

    if (fuel && fuel.length > 0) {
      carDetails = carDetails.filter((car) => fuel.includes(car.fuel));
    }

    if (seat && seat.length > 0) {
      carDetails = carDetails.filter((car) => seat.includes(car.seatCapacity));
    }

    if (sort === "lowtohigh") {
      return carDetails.sort(
        (carA, carB) => Number(carA.rentAmount) - Number(carB.rentAmount)
      );
    } else if (sort === "hightolow") {
      return carDetails.sort(
        (carA, carB) => Number(carB.rentAmount) - Number(carA.rentAmount)
      );
    }

    carDetails = carDetails.filter((car) => car.isVerified === true);

    return carDetails;
  }

  async userCarDetails(id: string): Promise<ICarWithHostName | null> {
    const response = (await userRepository.userCarDetails(
      id
    )) as ICarWithHostName;

    // if (response) {
    //   const id = response.userId.toString();
    //   const hostDetails = await userRepository.getUserDetails(id);
    //   const obj = response.toObject();
    //   const result: ICarWithHostName = {
    //     ...obj,
    //     hostName: hostDetails?.name,
    //   };

    //   return result;
    // }
    return response;
  }

  async getCarMake(): Promise<ICarMakeCategory[]> {
    return await userRepository.getCarMake();
  }
  async getCarType(): Promise<ICarTypeCategory[]> {
    return await userRepository.getCarType();
  }

  async setCarDate(dateFrom:Date,dateTo:Date,carId:string): Promise<ICar | null> {
    return await userRepository.setCarDate(dateFrom,dateTo,carId)
  }
  async successOrder(orderId:string,toDate:Date,fromDate:Date,carId:string,paymentId:string,amount:number,userId:string):Promise<OrderType | undefined>{
    const order = {
      orderId:orderId,
      carId:carId,
      amount:amount/100,
      pickUpDate:fromDate,
      dropOffDate:toDate,
      userId:userId,
      paymentId:paymentId,
      status:'success'
    }
    const response = await userRepository.successOrder(order)
    if(!response){
      return{
        successOrder:false,
        message:'failed to create order'
      }
    }
    return{
      successOrder:true,
      message:'order created successfully!'
    } 

  }
}

export default new UserService();
