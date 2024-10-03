import {Router} from 'express'
import userController from '../controllers/user_controller'
import verifyUser from '../middlewares/auth_middlewares'
import upload from '../services/upload_service'


const router: Router = Router()

router.post('/checkMail',userController.checkUserMail)
router.post('/userRegister',userController.createUser) 
router.post('/userLogin',userController.userLogin)
router.post('/userprofile',upload.fields([{name:'drivingIDFront',maxCount:1},{name:'drivingIDBack',maxCount:1}]),userController.userProfileCompletion)
router.post('/logout',userController.userLogout)
router.get('/authorized',verifyUser,userController.authorizedUser) 
router.get('/userDetails',verifyUser,userController.userDetails)
router.get('/getrentcardetails',userController.rentCarDetails)
router.get('/cardetails',userController.userCarDetails)

router.get('/getcarmake',userController.getCarMake)
router.get('/getcartype',userController.getCarType)
router.post('/hostregister',upload.fields([{name:'images',maxCount:5},{name:'RCDoc',maxCount:1},{name:'InsuranceDoc',maxCount:1}]),userController.hostCarDetails)
router.get('/getcardetails',verifyUser,userController.carDetails)


export default router;