import React,{useEffect, useState} from 'react'
import Navbar from '../../../components/User/Navbar/Navbar'
import { CalendarIcon, MapPinIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from "../../../components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import { Badge } from "../../../components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../../api/axiosInstance'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'


const Orders:React.FC = () => {
    const userId = useSelector((state:RootState)=>state.userDetails.userId) as string
    const [filter, setFilter] = useState('all')
    const navigate = useNavigate()
    const[orders,setOrders] = useState([])

    
    
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case 'active':
            return 'bg-green-100 text-green-800'
          case 'upcoming':
            return 'bg-blue-100 text-blue-800'
          case 'completed':
            return 'bg-gray-100 text-gray-800'
          default:
            return 'bg-gray-100 text-gray-800'
        }
      }

      useEffect(()=>{
        axiosInstance.get('/userorders',{
          params:{
            userId
          }
        })
        .then(res=>{
          setOrders(res.data)
          
        })
      },[])

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-5xl p-10 mt-20">
      <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {orders.length?<div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Car</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order,ind)=>(
                 <TableRow key={ind}>
                 <TableCell>
                   <div className="font-medium">{order?.carId.make.name} {order?.carId.carModel}</div>
                   <div className="text-sm text-muted-foreground">Order ID: {order?._id}</div>
                 </TableCell>
                 <TableCell>
                   <div className="flex items-center">
                     <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                     <span className="text-sm">
                       {order?.pickUpDate.toString().slice(0,10)} to {order?.dropOffDate.toString().slice(0,10)}
                     </span>
                   </div>
                 </TableCell>
                 <TableCell>
                   <div className="flex items-center">
                     <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                     <span className="text-sm">Location</span>
                   </div>
                 </TableCell>
                 <TableCell>
                   <Badge className={getStatusColor('Upcoming')}>Upcoming</Badge>
                 </TableCell>
                 <TableCell>
                   <div className="font-semibold">{order?.amount.toFixed(2)}</div>
                 </TableCell>
                 <TableCell>
                   <div className="flex space-x-2">
                     <Button variant="outline" size="sm" onClick={()=>navigate('/orderdetails')}>
                       View Details
                       <ChevronRightIcon className="ml-2 h-4 w-4" />
                     </Button>
                     {/* {order.status === 'Upcoming' && (
                       <Button variant="destructive" size="sm">Cancel</Button>
                     )} */}
                   </div>
                 </TableCell>
               </TableRow>
            ))}
             
           
          </TableBody>
        </Table>
      </div>:<h1 className='font-semibold'>No Orders Found!</h1>}
      {orders === null && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No orders found</p>
        </div>
      )}
    </div>
        </div>
        </div>
    </>
  )
}

export default Orders
