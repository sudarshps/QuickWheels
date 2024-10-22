import { ObjectId } from 'mongodb'
import mongoose,{Document,Schema} from 'mongoose'

export interface IMessage extends Document{
    sender:ObjectId,
    receiver:ObjectId,
    content:string
}

const messageSchema:Schema<IMessage> = new Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    receiver:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    content:{type:String,required:true},
},{timestamps:true})

const messageModel = mongoose.model<IMessage>('Message',messageSchema)

export default messageModel