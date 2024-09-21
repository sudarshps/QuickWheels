import {Router} from 'express'
import adminController from '../controllers/admin_controller'


const router:Router = Router()


router.get('/getuserlist',adminController.getUserList)
router.get('/getuserdetails',adminController.getUserDetails)
router.get('/gethostlist',adminController.getHostList)
router.get('/gethostdetails',adminController.getHostDetails)
router.post('/adminlogin',adminController.login)
router.post('/verifyuser',adminController.verifyUser)
router.post('/verifyhost',adminController.verifyHost)

export default router