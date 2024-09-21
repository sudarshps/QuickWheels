import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const CarDetailsSection:React.FC = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const id = queryParams.get('id')

  const[carImages,setCarImages] = useState<string[]>([])
  const[make,setMake] = useState('')
  const[model,setModel] = useState('')
  const[transmission,setTransmission] = useState('')
  const[fuel,setFuel] = useState('')
  const[seat,setSeat] = useState('')
  const[hostName,setHostName] = useState('')
  
  useEffect(()=>{
    axios.get('http://localhost:3000/cardetails',{
      params:{
        id
      }
    })
    .then(res=>{
      setCarImages(res.data.images)
      setMake(res.data.make)
      setModel(res.data.carModel)
      setTransmission(res.data.transmission)
      setFuel(res.data.fuel)
      setSeat(res.data.seatCapacity)
      setHostName(res.data.hostName)
    })
  },[id])  
  
  return (
    <>
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg p-2 shadow-md overflow-hidden mb-6">
              <img src={`http://localhost:3000/${carImages[0]}`} alt="image" className="w-full h-96 object-cover" />
              <div className="mt-2 flex space-x-2">
                {carImages.slice(1).map((img,ind)=>(
                    <img key={ind} src={`http://localhost:3000/${img}`} alt="Interior" className="w-1/3 h-24 object-cover rounded" />
                ))}
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-2">{make} <span>{model}</span></h1>
            <div className="flex items-center mb-4">
              <span className="text-gray-600 mr-4">{transmission} · {fuel} · {seat}</span>
              
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2" />
              <span>Hosted by {hostName}</span>
            </div>
            </div>
            </>
  )
}

export default CarDetailsSection
