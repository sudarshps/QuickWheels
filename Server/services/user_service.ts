import userRepository from "../repositories/user_repository";
import { IUser } from "../models/user_model";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken } from "../utils/jwt_utils";
import { ICar } from "../models/car_model";
import { ICarMakeCategory } from "../models/carmake-category_model";
import { ICarTypeCategory } from "../models/cartype-category_model";
import { IOrder } from "../models/orders";
import { IWallet } from "../models/wallet_model";

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
  id?: ObjectId;
  model?: string;
  registerNumber?: string;
  insuranceExp?: string;
  images?: string[];
  status?: string;
  note?: string;
  dateFrom?: Date;
  dateTo?: Date;
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
  isVerified?: boolean;
  status?: string;
  role?: string[];
  message?: string;
}

interface UserDetails {
  id?: ObjectId;
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
  successOrder: boolean;
  message: string;
}

interface CarStatus {
  isRemoved: boolean;
  message: string;
}

interface OrderCancelType {
  isCancelled: boolean;
  message: string;
}

class UserService {
  async createUser(userData: Partial<IUser>): Promise<UserResponse> {
    const hashedPassword = await bcrypt.hash(userData.password as string, 10);
    userData.password = hashedPassword;

    const userWallet = await userRepository.createWallet();

    if (!userWallet) {
      return {
        userCreated: false,
        message: "error while registering user wallet",
      };
    }

    userData.wallet = userWallet._id;
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
    status: string,
    isActive: boolean
  ): Promise<CarDetailsResponse> {
    const carDetails = await userRepository.carDetails(
      email,
      carData,
      isVerified,
      status,
      isActive
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

  async getCarDetails(email: string): Promise<ICar[] | null> {
    const carDetails = await userRepository.getCarDetails(email);

    if (!carDetails) {
      return null;
    }

    return carDetails;
  }

  async rentCarDetails(
    userId: string,
    sort: string,
    transmission: string[],
    fuel: string[],
    seat: string[],
    lng: number,
    lat: number,
    distanceValue: number,
    searchInput: string,
    carType: string[],
    make: string,
    dateFrom: Date | undefined,
    dateTo: Date | undefined
  ): Promise<ICar[] | null> {
    let carDetails = await userRepository.getRentCarDetails();

    if (carDetails && lng !== 0 && lat !== 0) {
      carDetails = await userRepository.getCarDistance(lng, lat, distanceValue);
    }

    if (carDetails && searchInput.trim()) {
      const regex = new RegExp(searchInput, "i");
      carDetails = carDetails?.filter((car) => {
        const carTypeName =
          car.carType &&
          typeof car.carType === "object" &&
          "name" in car.carType
            ? car.carType.name
            : "";
        const carMakeName =
          car.make && typeof car.make === "object" && "name" in car.make
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

    if (dateFrom && dateTo) {
      carDetails = carDetails.filter((car) => {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);
        if (car.reservedDateFrom && car.reservedDateTo) {
          return (
            to < car.reservedDateFrom ||
            (from > car.reservedDateTo &&
              from >= car.availabilityFrom &&
              to <= car.availabilityTo)
          );
        }

        return from >= car.availabilityFrom && to <= car.availabilityTo;
      });
    }

    if (userId) {
      carDetails = carDetails.filter((car) => {
        return car.userId.toString() !== userId;
      });
    }

    if (make) {
      carDetails = carDetails.filter((car) => {
        const carMakeName =
          typeof car.make === "object" && "name" in car.make
            ? car.make.name
            : "";
        return carMakeName === make;
      });
    }

    if (transmission && transmission.length > 0) {
      carDetails = carDetails.filter((car) =>
        transmission.includes(car.transmission)
      );
    }

    if (carType && carType.length > 0) {
      carDetails = carDetails.filter((car) => {
        const carTypeName =
          typeof car.carType === "object" && "name" in car.carType
            ? car.carType.name
            : "";
        return carType.includes(carTypeName);
      });
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

    carDetails = carDetails.filter(
      (car) => car.isVerified === true && car.isActive === true
    );

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

  async setCarDate(
    dateFrom: Date,
    dateTo: Date,
    carId: string
  ): Promise<ICar | null> {
    return await userRepository.setCarDate(dateFrom, dateTo, carId);
  }
  async successOrder(
    orderId: string,
    toDate: Date,
    fromDate: Date,
    carId: string,
    paymentId: string,
    method: string,
    amount: number,
    userId: string
  ): Promise<IOrder | undefined> {
    let orderAmount = amount
    if(method==='razorpay'){
      orderAmount = amount/100
    }
    
    const order = {
      orderId: orderId,
      carId: carId,
      amount: orderAmount,
      pickUpDate: fromDate,
      dropOffDate: toDate,
      userId: userId,
      paymentId: paymentId,
      method: method,
      status: "success",
    };
    const response = await userRepository.successOrder(order);
    if (!response) {
      return undefined;
    }

    // wallet money deduction
    if (method === "wallet") {

      const getWallet = await userRepository.getWallet(userId);
      const walletId = getWallet?.wallet._id.toString();
      if (!walletId) {
        return undefined;
      }
      const history = {
        date: new Date(),
        type: "Debit",
        amount: amount,
        reason: "Order Placed",
      };

      const moneyDeducted = await userRepository.deductMoney(
        walletId,
        amount,
        history
      );

      if (!moneyDeducted) {
        return undefined;
      }
      const reserveCar = await userRepository.reserveCar(
        carId,
        toDate,
        fromDate
      );
      
      if (!reserveCar) {
        return undefined;
      }
      return response;
    }
    const reserveCar = await userRepository.reserveCar(carId, toDate, fromDate);
    if (!reserveCar) {
      return undefined;
    }
    return response;
  }

  async userOrders(userId: string): Promise<IOrder[] | null> {
    return await userRepository.userOrders(userId);
  }

  async removeHostCar(carId: string): Promise<CarStatus> {
    const response = await userRepository.removeHostCar(carId);
    if (!response) {
      return {
        isRemoved: false,
        message: "car removal failed",
      };
    }
    return {
      isRemoved: true,
      message: "car removed successfully",
    };
  }

  async orderDetails(orderId: string): Promise<IOrder | null> {
    return await userRepository.orderDetails(orderId);
  }

  async cancelOrder(orderId: string): Promise<OrderCancelType> {
    const response = await userRepository.cancelOrder(orderId);
    if (!response) {
      return {
        isCancelled: false,
        message: "Order was not cancelled",
      };
    }
    // removing the reserved date from car model
    const carId = response.carId.toString();
    const updateCarDetails = await userRepository.cancelCarReservation(carId);

    if (!updateCarDetails) {
      return {
        isCancelled: false,
        message: "Order was not cancelled",
      };
    }
    const amount = response.amount;
    const userId = response.userId.toString();
    const reason = "Cancelled the order";
    const refundDate = new Date();
    const getWalletId = await userRepository.findWallet(userId);

    const history = {
      date: refundDate,
      type: "Credit",
      amount: amount,
      reason: reason, 
    };
    if (!getWalletId) {
      return {
        isCancelled: false,
        message: "refund error",
      };
    }
    const walletId = getWalletId.wallet.toString();

    const refundAmount = await userRepository.refundAmount(
      walletId,
      history,
      amount
    );

    if (!refundAmount) {
      return {
        isCancelled: false,
        message: "refund error",
      };
    }
    return {
      isCancelled: true,
      message: "Order cancellation successful",
    };
  }

  async getWallet(userId: string): Promise<Partial<IUser> | null> {
    return await userRepository.getWallet(userId);
  }
}

export default new UserService();
