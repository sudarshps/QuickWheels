import {Router} from 'express'
import ChatController from '../controllers/chat_controller'
import verifyUser from '../middlewares/auth_middlewares'


const routes:Router = Router()

routes.post('/sendmessage',verifyUser,ChatController.sendMessage)
routes.get('/getmessages',verifyUser,ChatController.getMessage)


export default routes