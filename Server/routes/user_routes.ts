import {Router} from 'express'
import userController from '../controllers/user_controller'


const router: Router = Router()

router.post('/checkMail',userController.checkUserMail)
router.post('/userRegister',userController.createUser)
router.post('/userLogin',userController.userLogin)

export default router;