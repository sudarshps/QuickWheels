import { IChat } from '../models/chat_model'
import { IMessage } from '../models/message_model'
import ChatRepository from '../repositories/chat_repository'

class ChatService {
    async sendMessage(message:string,receiverId:string,senderId:string):Promise<IMessage | undefined| null> {
        try {
            let chat = await ChatRepository.checkChat(receiverId,senderId)
 
            if(!chat){
                 chat = await ChatRepository.createChat(receiverId,senderId)
            }

            const newMessage = await ChatRepository.newMessage(receiverId,senderId,message) as IMessage

            if(!chat || !newMessage){
                return null 
            }
            const chatId = chat._id.toString()
            if(newMessage && '_id' in newMessage){
                const messageId = (newMessage._id as unknown as string).toString()
                const pushMessage = await ChatRepository.pushMessage(chatId,messageId)
                if(!pushMessage){
                    return null
                }
                return newMessage
            }
            return null
        } catch (error) {
            console.error('error in sending message',error);
        }
    }

    async getMessages(senderId:string,receiverId:string):Promise<IChat | undefined | null>{
        try {
            const message = await ChatRepository.getMessages(senderId,receiverId)
            if(!message)return null
            return message
        } catch (error) {
            console.error('error while fetching messages',error);
        }
    }
}


export default new ChatService()

