import React, { useEffect, useState } from "react";
import Sidebar from "./Components/Sidebar";
import Navbar from "../../../components/User/Navbar/Navbar";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "../../../components/Tooltip/Tooltip";
import {
  faClock,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { DatePickerWithRange } from "../../../components/ui/daterangepicker";
import { DateRange } from "react-day-picker";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HostDashboard: React.FC = () => {
  const email = useSelector((state: RootState) => state.auth.email);
  const [carId, setCarId] = useState('')
  const [model, setModel] = useState("");
  const [registerNumber, setRegisterNumber] = useState("");
  const [insuranceExp, setInsuranceExp] = useState("");
  const [images, setImages] = useState("");
  const [status, setStatus] = useState("");
  const [note,setNote] = useState("");
  const [carDateFrom,setCarDateFrom] = useState<Date | null>(null)
  const [carDateTo,setCarDateTo] = useState<Date | null>(null)
  const [refresh,setRefresh] = useState(false)
  const [availabilityDate,setAvailabilityDate] = useState<DateRange | undefined>()
  const navigate = useNavigate();

  const handleDate = (date:DateRange | undefined) => {
    setAvailabilityDate(date)
  }  

  useEffect(() => {
    if (email) {
      try {
        axiosInstance
          .get("/getcardetails", {
            params: { email },
          })
          .then((res) => {
            if (res.data) {
              setCarId(res.data.id)
              setModel(res.data.model);
              setRegisterNumber(res.data.registerNumber);
              setInsuranceExp(res.data.insuranceExp);
              setImages(res.data.images[0]);
              setStatus(res.data.status);
              setCarDateFrom(res.data.dateFrom)
              setCarDateTo(res.data.dateTo)
              setNote(res.data.note)
            }
          });
      } catch (error) {
        console.error("error in fetching car details", error);
      }
    }
  }, [email,refresh]);

  const handleAvailabilitySet = () => {

    const dateFrom = availabilityDate?.from
    const dateTo = availabilityDate?.to

    axiosInstance.put('/setavailablitydate',{dateFrom,dateTo,carId})
    .then(res=>{
      if(res.data.dateUpdated){
        toast.success('Date set successfully!')
        setRefresh(prev => !prev)
      }else{
        toast.error('Date was not updated!')
        setRefresh(prev => !prev)
      }
    })
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <ToastContainer/>
        <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8 mt-20">
          <div className="flex">
            <Sidebar />
            <div className="w-3/4 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-5">My Cars</h2>
              <div className="relative p-6 bg-white shadow rounded">
                <span className="absolute top-2 right-2 text-gray-700 px-2 py-1 rounded">
                  {status === "Verification Pending" ? (
                    <div className="text-gray-500">
                      <FontAwesomeIcon icon={faClock} />
                      {status}
                    </div>
                  ) : status === "Verified" ? (
                    <div className="text-green-500">
                      <FontAwesomeIcon icon={faCircleCheck} />
                      {status}
                    </div>
                  ) : (
                    <Tooltip content={note} elements={<div className="text-red-500">
                      <FontAwesomeIcon icon={faCircleXmark} />
                      {status}
                    </div>}/>
                  )}

                </span>

                <div className="flex">
                  <img
                    src={`http://localhost:3000/${images}`}
                    alt="Car"
                    className="w-40 h-24 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="text-xl font-bold">{registerNumber}</h3>
                    <p className="text-lg font-semibold">{model}</p>
                    <p>
                      Insurance:{" "}
                      <span className="text-green-600">{insuranceExp}</span>
                    </p>
                    <p className="flex items-center  ">
                      Availability: <span className="ms-2">{carDateFrom?.toString().slice(0,10)} - {carDateTo?.toString().slice(0,10)}</span>
                      
                    </p>
                    <p className="mt-4 flex">
                      <span><DatePickerWithRange onDateChange={handleDate}/></span>
                      <button className="bg-yellow-500 text-white px-4 py-2 ms-2 text-sm rounded mr-2" onClick={handleAvailabilitySet}>
                    Set 
                  </button>
                    </p>
                    
                  </div>
                </div>
                <div className="flex mt-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => navigate("/editcardetails")}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HostDashboard;
