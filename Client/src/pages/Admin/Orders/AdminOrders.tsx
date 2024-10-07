import React,{useState} from 'react'
import Navbar from '../../../components/Admin/Navbar/AdminNavbar'

const AdminOrders:React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>  
    <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar/>
      <div className="p-4 md:p-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
            User Orders
          </h2>
          
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 rounded-lg w-full md:w-1/2 lg:w-1/3 text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          </div>
    </div>
    </>
  )
}

export default AdminOrders
