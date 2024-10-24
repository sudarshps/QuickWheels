import { Request, Response, Express } from "express";
import UserService from "../services/user_service";
import { IUser } from "../models/user_model";
import upload from "../services/upload_service";
import { renewToken } from "../utils/jwt_utils";

interface UploadedUserFiles {
  drivingIDFront: Express.Multer.File[];
  drivingIDBack: Express.Multer.File[];
}

interface UploadedCarFiles {
  images: Express.Multer.File[];
  RCDoc: Express.Multer.File[];
  InsuranceDoc: Express.Multer.File[];
}

class UserController {
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { userName, password, email } = req.body;

      const createUser = await UserService.createUser({
        name: userName,
        password,
        email,
        isVerified: false,
        isHost: false,
        isActive:true,
        profileUpdated: false,
        status: "Verification Pending",
        approvedHost: false,
        role: ["USER"],
      });
      res.json(createUser);
    } catch (error) {
      console.error("error in creating user");
    }
  }

  async checkUserMail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const validate = await UserService.validateEmail({ email });

      res.status(200).json(validate);
    } catch (error) {
      console.error("Error in mail checking", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async userLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const validate = await UserService.validateUser({ email, password });
      if (validate.validUser) {
        const accessToken = validate.accessToken;
        const refreshToken = validate.refreshToken;

        res.cookie("accessToken", accessToken, { maxAge: 1800000 });
        res.cookie("refreshToken", refreshToken, {
          maxAge: 5 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        res.status(200).json(validate);
      } else {
        res.json(validate);
      }
    } catch (error) {
      console.error("error in logging user", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async userProfileCompletion(req: Request, res: Response) {
    if (!req.files) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    let { longitude, latitude, ...userData } = req.body;

    function isUploadedFiles(files: any): files is UploadedUserFiles {
      return (
        files &&
        typeof files === "object" &&
        "drivingIDFront" in files &&
        "drivingIDBack" in files
      );
    }

    if (isUploadedFiles(req.files)) {
      const paths = {
        drivingIDFrontPath: req.files.drivingIDFront[0].path,
        drivingIDBackPath: req.files.drivingIDBack[0].path,
      };

      userData.drivingIDFront = paths.drivingIDFrontPath;
      userData.drivingIDBack = paths.drivingIDBackPath;
      userData.profileUpdated = true;

      const userProfile = await UserService.userProfile(
        userData,
        longitude,
        latitude
      );

      res.json(userProfile);
    } else {
      return res.status(400).json({ message: "Incorrect file structure" });
    }
  }

  async userLogout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("accessToken", {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
      });

      res.clearCookie("refreshToken", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res
        .status(200)
        .json({ status: true, message: "Logged out successfully" });
    } catch (error) {
      console.error("user logout server error", error);
    }
  }

  async authorizedUser(req: Request, res: Response): Promise<object> {
    try {
      const userPayload = req.user;

      return res.json({
        user: userPayload,
        valid: true,
        message: "authorized user",
      });
    } catch (error) {
      return res.json({ valid: false, message: "not authorized" });
    }
  }

  async userDetails(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;
    try {
      const userDetails = await UserService.userDetails(email);
      if (userDetails) {
        res.json(userDetails);
      }
    } catch (error) {
      console.error("error fetching user details", error);
    }
  }

  // Host

  async hostCarDetails(req: Request, res: Response) {
    try {
      const { email, ...rest } = req.body;

      if (!req.files) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      let carData = rest;

      function isUploadedFiles(files: any): files is UploadedCarFiles {
        return (
          files &&
          typeof files === "object" &&
          "images" in files &&
          "RCDoc" in files &&
          "InsuranceDoc" in files
        );
      }

      if (isUploadedFiles(req.files)) {
        const paths = {
          images: req.files.images.map((file) => file.path),
          RCDoc: req.files.RCDoc[0].path,
          InsuranceDoc: req.files.InsuranceDoc[0].path,
        };

        carData.images = paths.images;
        carData.RCDoc = paths.RCDoc;
        carData.InsuranceDoc = paths.InsuranceDoc;

        let isVerified = false;
        let status = "Verification Pending";
        let isActive = true;

        const carDetails = await UserService.carDetails(
          email,
          carData,
          isVerified,
          status,
          isActive
        );

        res.json(carDetails);
      } else {
        return res.status(400).json({ message: "Incorrect file structure" });
      }
    } catch (error) {
      console.error("error in creating user");
    }
  }

  async carDetails(req: Request, res: Response): Promise<void> {
    const email = req.query.email as string;

    try {
      const carDetails = await UserService.getCarDetails(email);
      if (carDetails) {
        res.json(carDetails);
      }
    } catch (error) {
      console.error("error fetching user details", error);
    }
  }

  async rentCarDetails(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.query.userId as string
      const sort = req.query.sort as string;
      const make = req.query.carMake as string;
      const transmission = req.query.transmission as string[];
      const fuel = req.query.fuel as string[];
      const seat = req.query.seat as string[];
      const distance = req.query.distance as string[];
      const searchInput = req.query.userSearch as string;
      const carType = req.query.carType as string[];
      let lngQuery = req.query.lng;
      let latQuery = req.query.lat;
      let distanceValue = 0;
      const dateFrom = req.query.dateFrom as Date | undefined
      const dateTo = req.query.dateTo as Date | undefined           
      
      if (distance) {
        distanceValue = parseFloat(distance[0]);
      }

      let lng: number | undefined;
      let lat: number | undefined;

      if (typeof lngQuery === "string") {
        lng = parseFloat(lngQuery);
      }

      if (typeof latQuery === "string") {
        lat = parseFloat(latQuery);
      }

      if (lng === undefined || isNaN(lng) || lat === undefined || isNaN(lat)) {
        res.status(400).send({ error: "Invalid longitude or latitude value" });
        return;
      }

      const carDetails = await UserService.rentCarDetails(
        userId,
        sort,
        transmission,
        fuel,
        seat,
        lng,
        lat,
        distanceValue,
        searchInput,
        carType,
        make,
        dateFrom,
        dateTo
      );      
      res.json(carDetails);
    } catch (error) {
      console.error("error in fetching rent car details", error);
    }
  }

  async userCarDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id,userId } = req.query;
      
      const carDetails = await UserService.userCarDetails(id as string);
      res.json(carDetails);
    } catch (error) {
      console.error("error in fetching user car details", error);
    }
  }

  async getCarMake(req: Request, res: Response): Promise<void> {
    try {
      const response = await UserService.getCarMake();
      res.json(response);
    } catch (error) {
      console.error("error in getting car make list", error);
    }
  }

  async getCarType(req: Request, res: Response): Promise<void> {
    try {
      const response = await UserService.getCarType();
      res.json(response);
    } catch (error) {
      console.error("error in getting car make list", error);
    }
  }

  async setCarDate(req: Request, res: Response): Promise<void> {
    try {
      const { dateFrom, dateTo, carId } = req.body;
      const response = await UserService.setCarDate(dateFrom, dateTo, carId);
      if (!response) {
        res.json({ dateUpdated: false, message: "not updated" });
      }
      res.json({
        dateFrom: response?.availabilityFrom,
        dateTo: response?.availabilityTo,
        dateUpdated: true,
        message: "updated",
      });
    } catch (error) {
      console.error("error in updating availability date!", error);
    } 
  }

  async successOrder(req:Request,res:Response):Promise<void> {
    try {
      const {orderId,toDate,fromDate,carId,paymentId,method,amount,userId} = req.body
      
      const response = await UserService.successOrder(orderId,toDate,fromDate,carId,paymentId,method,amount,userId)  
      res.json(response)
    } catch (error) {
      console.error('error in posting success order!',error);
    }
  }

  async userOrders(req:Request,res:Response):Promise<void> {
    try {
      const userId = req.query.userId as string 
      const response = await UserService.userOrders(userId)            
      res.json(response)
    } catch (error) {
      console.error('error in fetching user orders',error);
      
    }
  }

  async removeHostCar(req:Request,res:Response):Promise<void> {
    try {
      const{carId} = req.body
      const response = await UserService.removeHostCar(carId)
      res.json(response)
    } catch (error) {
      console.error('error in deleting the host car',error);
      
    }
  }

  async orderDetails(req:Request,res:Response):Promise<void> {
    try {
      const orderId = req.query.orderId as string
      const response = await UserService.orderDetails(orderId)      
      res.json(response)
    } catch (error) {
      console.error('error while getting order details',error);
    }
  }

  async cancelOrder(req:Request,res:Response):Promise<void>{
    try {
      const orderId = req.body.id as string
      const response = await UserService.cancelOrder(orderId)
      res.json(response)
    } catch (error) {
      console.error('error in cancelling order',error);
    }
  }

  async getWallet(req:Request,res:Response):Promise<void>{
    try {
      const userId = req.query.userId as string
      const response = await UserService.getWallet(userId)
      res.json(response)
    } catch (error) {
      console.error('error while fetching wallet details',error);
    }
  }

}
 
export default new UserController();
