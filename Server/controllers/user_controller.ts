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
        profileUpdated:false,
        status:'Verification Pending',
        approvedHost:false
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
          maxAge: 5*60*60*1000,
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
        let {longitude,latitude,...userData} = req.body
                
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

      userData.drivingIDFront = paths.drivingIDFrontPath
      userData.drivingIDBack = paths.drivingIDBackPath
      userData.profileUpdated = true

      const userProfile = await UserService.userProfile(userData,longitude,latitude)

      res.json(userProfile)
      
      
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

  async userDetails(req:Request,res:Response): Promise<void> {
    const email = req.query.email as string 
    try {
      const userDetails = await UserService.userDetails(email) 
      if(userDetails){
        res.json(userDetails)            
      }
    } catch (error) {
      console.error('error fetching user details',error)
    }
  }

// Host 

  async hostCarDetails(req: Request, res: Response) {
    try {
      const {email,...rest} = req.body;
       
      if (!req.files) {
        
        return res.status(400).json({ message: "No files uploaded" });
      }
          let carData = rest
          
          
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
          images: req.files.images.map(file=>file.path),
          RCDoc: req.files.RCDoc[0].path,
          InsuranceDoc: req.files.InsuranceDoc[0].path
        };
  
        carData.images = paths.images
        carData.RCDoc = paths.RCDoc
        carData.InsuranceDoc = paths.InsuranceDoc

        let isVerified = false
        let status = 'Verification Pending'

        const carDetails = await UserService.carDetails(email,carData,isVerified,status)
        
        res.json(carDetails)
        
        
      } else {
        return res.status(400).json({ message: "Incorrect file structure" });
      }
     
    } catch (error) {
      console.error("error in creating user");
    }
  }



  async carDetails(req:Request,res:Response): Promise<void> {
    const email = req.query.email as string
    
    try {
      const carDetails = await UserService.getCarDetails(email)
      if(carDetails){
        res.json(carDetails)
      }
      
      
    } catch (error) {
      console.error('error fetching user details',error)
    }
  }


  async rentCarDetails(req:Request,res:Response): Promise<void> {
    try {
      const sort = req.query.sort as string
      const transmission = req.query.transmission as string[] 
      const fuel = req.query.fuel as string[] 
      const seat = req.query.seat as string[] 
      const distance = req.query.distance as string[]
      let lngQuery = req.query.lng
      let latQuery = req.query.lat    
      let distanceValue = 0
      if(distance){
        distanceValue = parseFloat(distance[0])
      }

      let lng: number | undefined;
      let lat: number | undefined;

    if (typeof lngQuery === 'string') {
      lng = parseFloat(lngQuery);
    }

    if (typeof latQuery === 'string') {
      lat = parseFloat(latQuery);
    }

    if (lng === undefined || isNaN(lng) || lat === undefined || isNaN(lat)) {
      res.status(400).send({ error: "Invalid longitude or latitude value" });
      return;
    }
      
      const carDetails = await UserService.rentCarDetails(sort,transmission,fuel,seat,lng,lat,distanceValue)      
      res.json(carDetails)
    } catch (error) {
      console.error('error in fetching rent car details',error);
    }
  }

  async userCarDetails(req:Request,res:Response):Promise<void> {
    try {
      const {id} = req.query
      const carDetails = await UserService.userCarDetails(id as string)   
      res.json(carDetails)
         
    } catch (error) {
      console.error('error in fetching user car details',error);
      
    }
  }
 
}


 
export default new UserController();
