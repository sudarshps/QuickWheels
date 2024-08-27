import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar.tsx'
import './Home.css'
import { useLocation } from 'react-router-dom'

const Home: React.FC = () => {

  const [username,setUserName] = useState<string>('')
  const location = useLocation()

  useEffect(()=>{
    const queryParams = new URLSearchParams(location.search)
    const usernameParams = queryParams.get('username')

    if(usernameParams){
      setUserName(usernameParams)
      sessionStorage.setItem('username',usernameParams)
    }
  })

  return (
    <>
        <Navbar username={username}/>
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
        </div>
      </div>
    </>
  )
}

export default Home
