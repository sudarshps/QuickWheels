import { ObjectId } from 'mongodb'
import mongoose,{Document,Schema} from 'mongoose'


export interface IChat extends Document{
    _id:ObjectId,
    users:[ObjectId],
    messages:[ObjectId],

}


const chatSchema:Schema<IChat> = new Schema({
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Message',
        default:[]
    }]
},{timestamps:true})


const chatModel = mongoose.model<IChat>('Chat',chatSchema)

export default chatModel