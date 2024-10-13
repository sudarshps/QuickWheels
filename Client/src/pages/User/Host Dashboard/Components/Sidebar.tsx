import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar:React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="w-1/6 h-screen p-4 border-r border-gray-200 bg-white">
      <ul className="space-y-4 cursor-pointer">
        <li className="text-gray-700 font-semibold">My Cars</li>
        <li className="text-gray-700 font-semibold" onClick={()=>navigate('/hostregister')}>Add Car</li>
      </ul>
    </div>
  )
}

export default Sidebar
