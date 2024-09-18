import React,{useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import Navbar from '../../../components/User/Navbar/Navbar'
import './HostStartup.css'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/store'
import axios from 'axios'


const HostStartup:React.FC = () => {

  const userEmail = useSelector((state: RootState) => state.auth.email);

     
      const [updatedProfile, setUpdatedProfile] = useState(false);


  useEffect(() => {
    const fetchUserDetails = async () => {
      
      // if (profileUpdated) {
        if (userEmail) {
          try {
            await axios
              .get("http://localhost:3000/userDetails", {
                params: {
                  email: userEmail,
                },
              })
              .then((res) => {
                if (res.data) {
                  
                  setUpdatedProfile(res.data.profileUpdated)

                }
              });
          } catch (error) {
            console.error("Error fetching user details:", error);
          }
        } else {
          console.log("Email is not provided, request not sent.");
        }
      // }
    };

    fetchUserDetails();
  }, [userEmail, updatedProfile]);

    const navigate = useNavigate()
    // const profileUpdated = useSelector((state:RootState)=>state.auth.profileUpdated)

    const handleHostRoute = () => {
      if(updatedProfile){
        navigate('/hostregister')
      }else{
        alert('please complete your profile details')
        navigate('/profile')
      }
    }

  return (
    <>
      <Navbar/>
      <div className='host-page relative'>
        <div className="content-1 flex-none absolute top-32 mt-12 left-20">
        <h1 className='text-4xl font-bold'>
            Feel Free To Host With Us!
        </h1>
        <p className='text-xs text-gray-500 pt-8'>
        QuickWheels makes it easy for you to earn extra income by renting out your car to trusted drivers.<br/> Simply list your car, set your availability,
         and watch as your vehicle works for you. With our seamless process,<br/> you can manage your bookings and communicate with renters all in one place.
          Join our community of car hosts today<br/> and start earning from your car with minimal effort!
        </p>
        <button className='text-red-500 border border-red-500 mt-8 font-medium py-1 px-3 rounded hover:border-orange-500 hover:text-orange-500' onClick={handleHostRoute}>Get Started</button>
        </div>
      </div>
    </>
  )
}

export default HostStartup
