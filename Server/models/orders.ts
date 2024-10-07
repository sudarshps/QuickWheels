import mongoose,{Document,ObjectId,Schema} from 'mongoose'

export interface IOrder extends Document {
    carId: ObjectId;
    amount:number;
    pickUpDate:Date;
    dropOffDate:Date;
    userId:ObjectId;
    paymentId:ObjectId;
    status:string;
}

const orderSchema: Schema<IOrder> = new mongoose.Schema({
    carId:{type:Schema.Types.ObjectId,ref:'CarModel',required:true},
    amount:{type:Number,required:true},
    pickUpDate:{type:Date,required:true},
    dropOffDate:{type:Date,required:true},
    userId:{type:Schema.Types.ObjectId,ref:'User',required:true},
    paymentId:{type:Schema.Types.ObjectId,ref:'PaymentModel',required:true},
    status:{type:String,required:true}
},{timestamps:true})

const OrderModel = mongoose.model<IOrder>('OrderModel',orderSchema)

export default OrderModel