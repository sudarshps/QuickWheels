import mongoose,{Date, Document,Schema} from 'mongoose'


export interface IUser extends Document {
    name:string;
    email:string;
    password:string;
    dob:Date;
    phone:Number;
    drivingExpDate:Date;
    address:String;
    drivingID:String;
    drivingIDFront:String;
    drivingIDBack:String;
    isHost:Boolean;
    isVerified:Boolean;
    profileImage:String
}

const userSchema:Schema<IUser>= new Schema({
    name:{type:String},
    email:{type:String,required:true},
    password:{type:String},
    dob:{type:Date},
    phone:{type:Number},
    drivingExpDate:{type:Date},
    address:{type:String},
    drivingID:{type:String},
    drivingIDFront:{type:String},
    drivingIDBack:{type:String},
    isHost:{type:Boolean},
    isVerified:{type:Boolean},
    profileImage:{type:String}
},{timestamps:true})


const User = mongoose.model<IUser>('User',userSchema);

export default User