import {Router} from 'express'
import userController from '../controllers/user_controller'
import verifyUser from '../middlewares/auth_middlewares'
import upload from '../services/upload_service'
import makeOrder from '../utils/razor_pay'

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
router.put('/setavailablitydate',verifyUser,userController.setCarDate)
router.post('/successorder',verifyUser,userController.successOrder)
router.get('/userorders',verifyUser,userController.userOrders)
router.delete('/removecarfromhost',verifyUser,userController.removeHostCar)
router.get('/orderdetails',verifyUser,userController.orderDetails)
router.put('/cancelorder',verifyUser,userController.cancelOrder)
router.get('/getwalletdetails',verifyUser,userController.getWallet)
//razor pay
router.post('/order',verifyUser,makeOrder)

export default router;