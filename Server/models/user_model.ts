import { ObjectId } from 'mongodb';
import mongoose,{Date, Document,Schema} from 'mongoose'


export interface IUser extends Document {
    _id?:ObjectId;
    name:string;
    email:string;
    password:string;
    dob:string;
    phone:string;
    drivingExpDate:string;
    address:string;
    drivingID:string;
    drivingIDFront:string;
    drivingIDBack:string;
    isHost:Boolean;
    isVerified:Boolean;
    profileUpdated:Boolean;
    profileImage:string;
    status:string;
    approvedHost:Boolean
}

const userSchema:Schema<IUser>= new Schema({
    name:{type:String},
    email:{type:String,required:true},
    password:{type:String},
    dob:{type:String},
    phone:{type:String},
    drivingExpDate:{type:String},
    address:{type:String},
    drivingID:{type:String},
    drivingIDFront:{type:String},
    drivingIDBack:{type:String},
    isHost:{type:Boolean},
    isVerified:{type:Boolean},
    profileUpdated:{type:Boolean},
    profileImage:{type:String},
    status:{type:String},
    approvedHost:{type:Boolean}
},{timestamps:true})


const User = mongoose.model<IUser>('User',userSchema);

export default User