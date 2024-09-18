import {Router} from 'express'
import adminController from '../controllers/admin_controller'


const router:Router = Router()


router.get('/getuserlist',adminController.getUserList)
router.get('/getuserdetails',adminController.getUserDetails)
router.post('/adminlogin',adminController.login)
router.post('/verifyuser',adminController.verifyUser)

export default router