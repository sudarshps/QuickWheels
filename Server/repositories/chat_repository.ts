import ChatModel,{IChat} from '../models/chat_model'
import MessageModel,{IMessage} from '../models/message_model'

class ChatRepository{
    async checkChat(receiverId:string,senderId:string):Promise<IChat | null> {
        return await ChatModel.findOne({
            users:{$all:[senderId,receiverId]}
        })
    }
    
    async createChat(receiverId:string,senderId:string):Promise<IChat | null> {
        return await ChatModel.create({
            users:[senderId,receiverId],
            
        })
    }

    async newMessage(receiverId:string,senderId:string,message:string):Promise<IMessage | null> {
        
        return await MessageModel.create({
            sender:senderId,
            receiver:receiverId,
            content:message
        })as IMessage
    }

    async pushMessage(chatId:string,messageId:string):Promise<IChat | null> {
        return await ChatModel.findByIdAndUpdate(chatId,{$push:{messages:messageId}})
    }

    async getMessages(senderId:string,receiverId:string):Promise<IChat | null> {
        return await ChatModel.findOne({
            users:{$all:[senderId,receiverId]}
        }).populate("messages")
    }
}

export default new ChatRepository()