import React,{useState} from 'react'
import Navbar from '../../../components/User/Navbar/Navbar'
import { CalendarIcon, CarIcon, MapPinIcon, ChevronRightIcon } from 'lucide-react'
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

const orderslist = [
    { id: 'CR001', car: 'Toyota Camry', startDate: '2023-06-01', endDate: '2023-06-05', location: 'New York City', status: 'Active', price: 250 },
    { id: 'CR002', car: 'Honda Civic', startDate: '2023-06-10', endDate: '2023-06-12', location: 'Los Angeles', status: 'Upcoming', price: 180 },
    { id: 'CR003', car: 'Ford Mustang', startDate: '2023-05-15', endDate: '2023-05-18', location: 'Miami', status: 'Completed', price: 300 },
    { id: 'CR004', car: 'Chevrolet Malibu', startDate: '2023-06-20', endDate: '2023-06-25', location: 'Chicago', status: 'Upcoming', price: 275 },
    { id: 'CR005', car: 'Tesla Model 3', startDate: '2023-05-01', endDate: '2023-05-03', location: 'San Francisco', status: 'Completed', price: 400 },
  ]

const Orders:React.FC = () => {
    const [filter, setFilter] = useState('all')
    const navigate = useNavigate()

    const filteredOrders = orderslist.filter(order => {
        if (filter === 'all') return true
        return order.status.toLowerCase() === filter
      })
    
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
      <div className="overflow-x-auto">
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
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.car}</div>
                  <div className="text-sm text-muted-foreground">Order ID: {order.id}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-sm">
                      {order.startDate} to {order.endDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <MapPinIcon className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-sm">{order.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-semibold">${order.price.toFixed(2)}</div>
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
      </div>
      {filteredOrders.length === 0 && (
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
