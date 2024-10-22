import React,{useState,useEffect} from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import {
  CalendarIcon,
  CarIcon,
  MapPinIcon,
  ClockIcon,
  CreditCardIcon,
  PhoneIcon,
  MailIcon,
  ChevronLeft,
  CheckCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";



const OrderDetails: React.FC = () => {
  const[orderDetails,setOrderDetails] = useState()
  const[status,setStatus] = useState('Upcoming')
  
  // const diffFrom = Number(currentDate) - Number(dateFrom)
  // const daysDiffFrom = Math.floor(Math.abs(diffFrom)/(1000*60*60*24))
  // const diffTo = Number(dateTo) - Number(currentDate)
  // const daysDiffTo = Math.floor(Math.abs(diffTo)/1000*60*60*24)
  
  
  const [searchParams] = useSearchParams()
    const orderId = searchParams.get('id')
    useEffect(()=>{
      axiosInstance.get('/orderdetails',{
        params:{
          orderId
        }
      })
      .then(res=>{
        if(res.data){          
          setOrderDetails(res.data)
          if(res.data.status==='cancelled'){
            setStatus('Cancelled')
          }else{
            const currentDate = new Date()
            let dateFrom = new Date(orderDetails?.pickUpDate.slice(0,10))
            let dateTo = new Date(orderDetails?.dropOffDate.slice(0,10))

            if(currentDate>=dateFrom && currentDate<=dateTo){
              setStatus('Active')
            }else if(currentDate>=dateTo){
              setStatus('Completed')
            }

            // let timeDifference = Number(dateFrom) - Number(dateTo)
            // let numberOfDays = Math.abs(timeDifference) / (1000*60*60*24)
          }
        }
      })
    },[])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "upcoming":
        return "bg-blue-500 text-white";
      case "completed":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const handleAction = () => {    
    axiosInstance.put('/cancelorder',{id:orderId})
    .then(res=>{
      if(res.data){
        console.log(res.data);
        if(res.data.isCancelled){
        setStatus('Cancelled')
      }
    }
    })
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-10 mt-20">
          <div className="min-h-screen">
            <header className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                  {/* <button
                    onClick={() => console.log("Navigate back")}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ChevronLeft className="h-5 w-5 mr-1" />
                    Back to Orders
                  </button> */}
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      status
                    )}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Car Information
                      </h2>
                      <img
                        src={`http://localhost:3000/${orderDetails?.carId.images[0]}`}
                        alt={`${orderDetails?.carId.make.name} ${orderDetails?.carId.carModel}`}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold">
                        {orderDetails?.carId.make.name} {orderDetails?.carId.carModel}
                      </h3>
                      <div className="mt-2 flex items-center text-gray-600">
                        <CarIcon className="mr-2 h-4 w-4" />
                        <span>Order ID: {orderDetails?.orderId}</span>
                      </div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-4">
                        Rental Details
                      </h2>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <CalendarIcon className="mr-2 h-5 w-5" />
                          <span>
                            {orderDetails?.pickUpDate.slice(0,10)} - {orderDetails?.dropOffDate.slice(0,10)}
                          </span>
                        </div>
                        {/* <div className="flex items-center text-gray-600">
                          <ClockIcon className="mr-2 h-5 w-5" />
                          <span>
                            Pickup: {order.pickupTime} | Return:{" "}
                            {order.returnTime}
                          </span>
                        </div> */}
                        <div className="flex items-center text-gray-600">
                          <MapPinIcon className="mr-2 h-5 w-5" />
                          <span>{orderDetails?.carId.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Amount Details
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>
                            Car Rental 
                          </span>
                          <span>{orderDetails?.amount - 1500}.00</span>
                        </div>
                        <div className="flex justify-between text-gray-600 mb-2">
                          <span>Insurance</span>
                          <span>1500.00</span>
                        </div>
                        {/* <div className="flex justify-between text-gray-600 mb-2">
                          <span>Taxes and Fees</span>
                          <span>${order.taxes.toFixed(2)}</span>
                        </div> */}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-green-600">
                            {orderDetails?.amount}.00
                          </span>
                        </div>
                        {/* <div className="mt-2 flex items-center text-sm text-gray-500">
                          <CreditCardIcon className="mr-2 h-4 w-4" />
                          <span>Paid with Credit Card ending in 1234</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 border-t border-gray-200 pt-8">
                    <h2 className="text-2xl font-semibold mb-4">
                      Customer Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Name
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {orderDetails?.userId.name}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Email
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <MailIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.userId.email}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Phone
                        </h3>
                        <p className="mt-1 text-gray-900 flex items-center">
                          <PhoneIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {orderDetails?.userId.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 sm:px-8 sm:py-6">
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <button className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Download Receipt
                    </button>
                    {status === "Upcoming" && (
                      <>
                          <button
                            // onClick={}
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            
                          >
                            <AlertDialog>
                            <AlertDialogTrigger>
                              Cancel Order
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure want to{" "}
                                  cancel order?
                                </AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={
                                    handleAction
                                  }
                                >
                                  Yes
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                            
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
