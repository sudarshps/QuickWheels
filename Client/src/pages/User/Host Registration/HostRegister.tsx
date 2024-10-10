import {useState,useEffect} from 'react'
import { useMultiStepForm } from "../../../custom hooks/useMultiStepForm";
import CarDetails from './component/CarDetails';
import CarDocuments from './component/CarDocuments';
import Navbar from '../../../components/User/Navbar/Navbar';
import { RootState } from '../../../redux/store';
import './HostRegister.css'
import axiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData{
    make:string,
    carModel:string,
    carType:string,
    transmission:string,
    fuel:string,
    seatCapacity:string,
    rentAmount:string,
    features:string[],
    images:File[],
    registerNumber:string,
    insuranceExp:string,
    RCDoc:File|null,
    InsuranceDoc:File|null,
  }

  const initialData:FormData = {
    make:"",
    carModel:"",
    carType:"",
    transmission:"Manual",
    fuel:"Petrol",
    seatCapacity:"4-5 Seater",
    rentAmount:"",
    features:[],
    images:[],
    registerNumber:"",
    insuranceExp:"",
    RCDoc:null,
    InsuranceDoc:null,
  }


  

const RegisterForm = () => {


    const [data, setData] = useState(initialData);
    const userEmail = useSelector((state: RootState) => state.auth.email);
    const navigate = useNavigate()
    const location = useLocation()

    const heading = location.pathname === '/editcardetails' ? 'Edit Car Details' : 'Enter Car Details'


    function updateFields(fields:Partial<FormData>){
        setData(prev => {
            return {...prev,...fields}
        })
    }    
    const postData = {
      ...data,
      email:userEmail,
    }

    

    const handleNext = async() => {
      if(currentStepIndex===0){
        if(!data.make.trim()){
          toast.error('please provide make!')
          return
        }

        if(!data.carModel.trim()){
          toast.error('please provide model!')
          return
        }

        if(!data.rentAmount.trim()){
          toast.error('please provide rent amount!')
          return
        }
        
        next()
      }else{

        if(data.images.length < 4){
          toast.error('please upload 5 car images!')
          return
        }

        if(!data.registerNumber){
          toast.error('please enter car register number!')
          return
        }

        if(!data.insuranceExp){
          toast.error('please select insurance expiry date!')
          return
        }

        if(!data.RCDoc){
          toast.error('please upload RC Documents!')
          return
        }

        if(!data.InsuranceDoc){
          toast.error('please select insurance Documents!')
          return
        }        

        const {images,...rest} = postData
        
        const formData = new FormData()

        data.images.forEach((file,index)=>{
          formData.append(`images`,file)
        })
        

        Object.entries(rest).forEach(([key,value])=>{
          if(value instanceof File){
            formData.append(key,value)
          }else{
            formData.append(key,value)
          }
        })
         
        try {
          

          await axiosInstance.post('/hostregister',formData)
          .then(res=>{
            if(res.data.updatedCarDetails){
              toast.success('Registration completed!')
              setTimeout(() => {
                navigate('/')
              }, 6000);
            }
          })

        } catch (error) {
          console.error('error in registering host',error)
        }
        

      }
      
    }


    const {steps,currentStepIndex,step,next,back} = useMultiStepForm([
    <CarDetails {...data} updatedField={updateFields}/>,
    <CarDocuments {...data} updatedField={updateFields}/>])

    

  return (
    <>
     <Navbar />
     <div className="formbackground min-h-screen flex flex-col items-center justify-center">
      <ToastContainer/>
        <div className="bg-white mt-24 p-8 rounded-md shadow-md w-full md:w-1/2">
          {step}
          <div className="btn-div mt-12 flex justify-end space-x-4">
            {currentStepIndex > 0 && (
              <button
                onClick={back}
                className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
              {currentStepIndex === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
          
    </>
  )
}

export default RegisterForm
