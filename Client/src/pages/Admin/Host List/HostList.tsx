import React, { useState } from 'react'
import Navbar from '../../../components/Admin/Navbar/AdminNavbar'

const HostList:React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hosts,setHosts] = useState<User[]>([])

  return (
    <>
    <div className="min-h-screen bg-[#0A0C2D] px-12">
      <Navbar/>
      <div className="p-4 md:p-6">
          <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
            Host & Car Verification
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

export default HostList
