import { ObjectId } from 'mongodb'
import mongoose,{Document,Schema} from 'mongoose'


export interface ICar extends Document{
    _id?:ObjectId
    userId:ObjectId,
    make:string,
    carModel:string,
    transmission:string,
    seatCapacity:string,
    rentAmount:string,
    registerNumber:string,
    insuranceExp:string,
    fuel:string,
    features:[string],
    RCDoc:string,
    InsuranceDoc:string,
    isVerified:boolean,
    status:string,
    images:[string]
}


const carSchema:Schema<ICar> = new Schema({
    userId:{type:Schema.Types.ObjectId,ref:'User',requires:true},
    make:{type:String,required:true},
    carModel:{type:String,required:true},
    transmission:{type:String,required:true},
    seatCapacity:{type:String,required:true},
    rentAmount:{type:String,required:true},
    registerNumber:{type:String,required:true},
    insuranceExp:{type:String,required:true},
    fuel:{type:String,required:true},
    features:{type:[String],required:true},
    RCDoc:{type:String,required:true},
    InsuranceDoc:{type:String,required:true},
    isVerified:{type:Boolean,required:true},
    status:{type:String,required:true},
    images:{type:[String],required:true}
},{timestamps:true})



const CarModel = mongoose.model<ICar>('CarModel',carSchema)

export default CarModel