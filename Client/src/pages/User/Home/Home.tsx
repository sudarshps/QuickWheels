import React from 'react'
import Navbar from '../../../components/User/Navbar/Navbar.tsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'
import './Home.css'
import { useNavigate } from 'react-router-dom'


const Home: React.FC = () => {

  const navigate = useNavigate()

  return (
    <>
        <Navbar/>
        <div className='home-page relative'>
        <div className="content-1 flex-none absolute top-20 mt-12 left-20">
        <h1 className='text-4xl font-bold'>
            Enjoy Your Ride With<br/>
            Our Best Service
        </h1>
        <p className='text-xs text-gray-500 pt-8'>
        We provide you the best service. Discover a seamless car rental<br/> experience that puts you in the driver’s seat.<br/>
        Whether you're planning a quick city getaway or an epic road trip,<br/> we have the perfect vehicle to meet your needs. <br/>Choose from our wide range of cars,<br/> from compact city cars to spacious SUVs and luxury models. 
        </p>
        <button className='text-red-500 border border-red-500 mt-8 font-medium py-1 px-3 rounded hover:border-orange-500 hover:text-orange-500'>Rent Your Car</button>

        <div className="flex flex-wrap items-center justify-between ml-44 mt-[4.0rem] bg-white shadow-lg rounded-lg p-4 mt-6 mx-auto w-full max-w-7xl">
      <div className="flex items-center space-x-2 w-full md:w-auto mb-4 md:mb-0">
        <FontAwesomeIcon icon={faLocationArrow} className='text-red-500'/>
        <select className="border-none focus:ring-0 cursor-pointer text-sm text-gray-600 w-full md:w-auto">
          <option value="">Choose Your Location</option>
        </select>
      </div>

      <div className="flex items-center space-x-2 w-full md:w-auto mb-4 md:mb-0">
        <input 
          type="date" 
          className="border-none focus:ring-0 text-sm text-gray-600 cursor-pointer w-full md:w-auto" 
          placeholder="Pick-Up Date" 
        />
      </div>

      <div className="flex items-center space-x-2">
        <input 
          type="date" 
          className="border-none focus:ring-0 text-sm text-gray-600 cursor-pointer appearance-none" 
          placeholder="Return Date" 
        />

      </div>

      <button className="bg-red-500 text-white text-sm px-2 py-2 rounded-lg hover:bg-red-600" onClick={()=>navigate('/availablecars')}>
        Book Your Ride
      </button>
    </div>
        </div>
      </div>
    </>
  )
}

export default Home
