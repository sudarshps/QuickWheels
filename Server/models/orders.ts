import mongoose,{Document,ObjectId,Schema} from 'mongoose'

export interface IOrder extends Document {
    orderId:string,
    carId: ObjectId;
    amount:number;
    pickUpDate:Date;
    dropOffDate:Date;
    userId:ObjectId;
    paymentId:string;
    status:string;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    orderId:{type:String,requried:true},
    carId:{type:Schema.Types.ObjectId,ref:'CarModel',required:true},
    amount:{type:Number,required:true},
    pickUpDate:{type:Date,required:true},
    dropOffDate:{type:Date,required:true},
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true},
    paymentId:{type:String,required:true},
    status:{type:String,required:true}
},{timestamps:true})

const OrderModel = mongoose.model<IOrder>('OrderModel',orderSchema)

export default OrderModel