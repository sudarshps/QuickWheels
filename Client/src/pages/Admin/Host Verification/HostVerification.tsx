import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Admin/Navbar/AdminNavbar";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const HostVerification: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const navigate = useNavigate();

  interface HostDetails {
    make: string;
    carModel: string;
    transmission: string;
    seatCapacity: string;
    fuel: string;
    rentAmount: string;
    registerNumber: string;
    insuranceExp: string;
    phone: string;
    RCDoc:string;
    InsuranceDoc:string;
    isVerified:boolean;
    images:string;
  }

  const [hostDetails, setHostDetails] = useState<HostDetails | null>(null);
  const [frontIsEnlarged, setFrontIsEnlarged] = useState(false);
  const [backIsEnlarged, setBackIsEnlarged] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/admin/gethostdetails", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setHostDetails(res.data)        
      });
  }, [id]);

  const handleProceed = (status: string) => {
    let hostStatus = "Verified"
    if(status==="reject"){
      hostStatus = "Not Verified"
    }
    
      axios
        .post("http://localhost:3000/admin/verifyhost", { hostStatus, id })
        .then((res) => {
          if (res.data.statusUpdated) {
            alert("status updated!");
            navigate("/admin/userlist");
          }else{
            alert("status updated!");
            navigate("/admin/userlist");
          }
        });
  };

  return (
    <div className="min-h-screen bg-[#0A0C2D] px-4 md:px-8 lg:px-12">
      <Navbar />
      <div className="p-4 md:p-6">
        <div className="pl-44 mb-8">
          <h2 className="text-white text-xl md:text-2xl font-semibold">
            Host Verification
          </h2>
        </div>
        <div className="bg-gradient-to-br from-[#10114f] to-[#1416b5] rounded-md shadow-lg w-full max-w-3xl p-8 mx-auto space-y-8">
          {/* <div className="flex items-center space-x-6 ml-28">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center">
              <FontAwesomeIcon
                icon={faUser}
                className="text-3xl text-gray-700"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white">
                {userDetails?.name}
              </h1>
              <p className="text-gray-300">{userDetails?.email}</p>
            </div>
          </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="w-60 h-40 bg-gray-200 rounded flex justify-center items-center ml-28">
                <img src={`http://localhost:3000/${hostDetails?.images[0]}`} alt="" />
              </div>

              <div className='flex flex-col ml-28 gap-4'>
                <h1 className="text-white text-2xl font-bold">{hostDetails?.make}<span> {hostDetails?.carModel}</span></h1>
                <h2 className="text-white text-lg ">{hostDetails?.registerNumber}</h2>
              </div>
            </div>
              

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-white ml-28">
              <label className="text-gray-300">Fuel Type:</label>
              <h2 className="text-lg font-semibold mb-4">
                {hostDetails?.fuel}
              </h2>
              <label className="text-gray-300">Seat Capacity:</label>

              <h2 className="text-lg font-semibold mb-4">
                {hostDetails?.seatCapacity}
              </h2>

              <label className="text-gray-300">Transmission:</label>

              <h2 className="text-lg font-semibold mb-4">{hostDetails?.transmission}</h2>
            </div>
            <div className="text-white ml-28">
              <label className="text-gray-300">Rent Amount:</label>
              <h2 className="text-lg font-semibold mb-4">
                {hostDetails?.rentAmount}<span className="text-md font-normal text-gray-200">/hr</span>
              </h2>
              <label className="text-gray-300">Insurance Expiry:</label>

              <h2 className="text-lg font-semibold mb-4">
               {hostDetails?.insuranceExp}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center ml-8">
              <h2 className="text-lg text-white mb-2">Insurance</h2>
              <div className="w-40 h-24 bg-gray-200 rounded-md">
                <img
                  src={`http://localhost:3000/${hostDetails?.InsuranceDoc}`}
                  alt="License Front"
                  className={`w-full h-full object-cover transform transition-transform duration-300 hover:scale-150 ${
                    frontIsEnlarged ? "scale-200" : "scale-100"
                  }`}
                  onClick={() => setFrontIsEnlarged(!frontIsEnlarged)}
                />
              </div>
            </div>

            <div className="flex flex-col items-center ml-8">
              <h2 className="text-lg text-white mb-2">RC</h2>
              <div className="w-40 h-24 bg-gray-200 rounded-md">
                <img
                  src={`http://localhost:3000/${hostDetails?.RCDoc}`}
                  alt="License Back"
                  onClick={() => setBackIsEnlarged(!backIsEnlarged)}
                  className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-150 "
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-8 pe-16">
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleProceed("reject")}
            >
              Reject
            </button>
            <button
              className={`bg-blue-500 ${!hostDetails?.isVerified?`hover:bg-blue-600`:``} text-white font-bold py-2 px-4 rounded`}
              onClick={() => handleProceed("approve")}
              disabled={hostDetails?.isVerified?true:false}
            >
              {hostDetails?.isVerified?`Approved`:`Approve`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostVerification;
