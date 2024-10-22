import { Request,Response } from "express";
import ChatService from '../services/chat_service'

class ChatController {
    async sendMessage(req:Request,res:Response):Promise<void> {
        try {
            const {message,receiverId,senderId} = req.body            
            const chat = await ChatService.sendMessage(message,receiverId,senderId)
            res.json(chat)
        } catch (error) {
            console.error('error in creating chat room',error);
        }
    }

    async getMessage(req:Request,res:Response):Promise<void> {
        try {
            const{senderId,receiverId} = req.body
            const messages = await ChatService.getMessages(senderId,receiverId)
            res.json(messages)
        } catch (error) {
            console.error('erron while fetching message details',error);
        }
    }
}

export default new ChatController()