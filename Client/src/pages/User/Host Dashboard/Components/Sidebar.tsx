import React from 'react'


const Sidebar:React.FC = ({onSelect}) => {
  return (
    <div className="w-1/6 h-screen p-4 border-r border-gray-200 bg-white">
      <ul className="space-y-4 cursor-pointer">
        <li className="text-gray-700 font-semibold" onClick={()=>onSelect('mycars')}>My Cars</li>
        <li className="text-gray-700 font-semibold" onClick={()=>onSelect('addcar')}>Add Car</li>
        <li className="text-gray-700 font-semibold" onClick={()=>onSelect('orders')}>My Orders</li>
      </ul>
    </div>
  )
}

export default Sidebar
