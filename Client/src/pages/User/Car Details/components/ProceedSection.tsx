import React from 'react'

const ProceedSection:React.FC = () => {
  return (
    <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              
              <div className="border-b py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Trip Protection Package</span>
                  <span className="text-xl font-bold">₹1,500</span>
                </div>
                <button className="text-red-500 text-sm">Change</button>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Total Price</span>
                <div>
                  <span className="text-2xl font-bold">₹5,100</span>
                  <button className="text-red-500 text-sm block">View Details</button>
                </div>
              </div>
              <button className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors duration-300">
                PROCEED TO PAY
              </button>
            </div>
          </div>
  )
}

export default ProceedSection
