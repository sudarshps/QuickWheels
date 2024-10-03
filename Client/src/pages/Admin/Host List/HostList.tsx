import React, { useState,useEffect } from 'react'
import Navbar from '../../../components/Admin/Navbar/AdminNavbar'
import axios from '../../../api/axios';
import { useNavigate } from 'react-router-dom';


interface Host{
  _id:string;
   hostName:string;
   email:string;
   dob:string;
   carModel:string;
   status:string;
}

const HostList:React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hosts,setHosts] = useState<Host[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async() => {
        try {
            const response = await axios.get('/gethostlist')
            if(response.data){   
                const updatedProfile = response.data
                setHosts(updatedProfile)
            }
        } catch (error) {
            console.error('error fetching user list',error)
        }
    }

    fetchUsers()
  },[]);

  

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

          {hosts.length>0?<div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-xl shadow-lg overflow-x-auto">
            <table className="min-w-full text-left text-white">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-2 md:px-4">No.</th>
                  <th className="py-3 px-2 md:px-4">Name</th>
                  <th className="py-3 px-2 md:px-4">Email</th>
                  <th className="py-3 px-2 md:px-4">Car Model</th>
                  <th className="py-3 px-2 md:px-4">DOB</th>
                  <th className="py-3 px-2 md:px-4">Status</th>
                  <th className="py-3 px-2 md:px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((host,index)=>(
                        <tr key={index} className="border-b border-white/10">
                        <td className="py-3 px-2 md:px-4">{index+1}</td>
                        <td className="py-3 px-2 md:px-4">{host.hostName}</td>
                        <td className="py-3 px-2 md:px-4">{host.email}</td>
                        <td className="py-3 px-2 md:px-4">{host.carModel}</td>
                        <td className="py-3 px-2 md:px-4">{host.dob}</td>
                        <td className="py-3 px-2 md:px-4">{host.status}</td>
                        <td className="py-3 px-2 md:px-4 text-blue-300 hover:underline cursor-pointer" onClick={()=>navigate(`/admin/hostverification?id=${host._id}`)}>
                          View Details
                        </td>
                      </tr>
                )

                )}
                
              </tbody>
            </table>
          </div>:<div className="flex items-center justify-center"><p className="text-white">No Recored Found!</p></div>}
          </div>

          
      </div>
    </>
  )
}

export default HostList
