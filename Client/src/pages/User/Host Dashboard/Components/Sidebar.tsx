import React from 'react'

const Sidebar:React.FC = () => {
  return (
    <div className="w-1/4 h-screen p-4 border-r border-gray-200 bg-white">
      <ul className="space-y-4">
        <li className="text-gray-700 font-semibold">My Cars</li>
        <li className="text-gray-700 font-semibold">Add Car</li>
      </ul>
    </div>
  )
}

export default Sidebar
