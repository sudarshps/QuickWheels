import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import axiosInstance from "../../../../api/axiosInstance";

const ProceedSection: React.FC = ({ amount }) => {
  const [selectedHours, setSelectedHours] = useState<number | null>();
  useEffect(() => {
    const date = sessionStorage.getItem("date");
    if (date) {
      const parsedDate = JSON.parse(date);
      const toDate = new Date(parsedDate.to);
      const fromDate = new Date(parsedDate.from);
      const hourDiff = (toDate - fromDate) / (1000 * 60 * 60);
      setSelectedHours(hourDiff);
    }
  }, []);
  const username = useSelector((state:RootState) => state.auth.user) as string
  const email = useSelector((state: RootState) => state.auth.email) as string
  const verifiedUser = useSelector(
    (state: RootState) => state.userDetails.verifiedUser
  );

  const phone = useSelector((state:RootState)=>state.userDetails.phone) as string
  const navigate = useNavigate();

  const totalAmount = selectedHours * amount + 1500

  const handleLogin = () => {
    alert("please login to continue");
    navigate("/login");
  };

  const handleVerify = () => {
    alert("please verify your profile to proceed");
    navigate("/profile");
  };
  
  //razor pay

  const { error, isLoading, Razorpay } = useRazorpay();

  const makePayment = async() => {
    await axiosInstance.post('/order',{totalAmount})
    .then((res)=>{      
      if(res.data){
        const options: RazorpayOrderOptions = {
          key: import.meta.env.VITE_RAZOR_PAY_API,
          amount: res.data.amount, // Amount in paise
          currency: res.data.currency,
          name: "QuickWheels",
          description: "Order Transaction",
          order_id: res.data.order_id, // Generate order_id on server
          handler: (response) => {        
            console.log(response);
            alert("Payment Successful!");
          },
          prefill: {
            name: username,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#F37254",
          },
        };
    
        const razorpayInstance = new Razorpay(options);
        razorpayInstance.open();
      }
    })
    
  }
  return (
    <div className="lg:w-1/3">
      <div className="bg-red-100 rounded-lg shadow-md p-6 sticky top-20">
        <div className="border-b py-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Trip Protection Package</span>
            <span className="text-xl font-bold">₹1,500</span>
          </div>
          <button className="text-red-500 text-sm">Change</button>
        </div>
        <div className="flex justify-between items-center mb-6">
          <span className="font-semibold">Rent Amount</span>
          <div>
            <span className="text-xl font-bold">₹{amount}/hr</span>
          </div>
        </div>
        {selectedHours ? (
          <div className="flex justify-between items-center mb-6">
            <span className="font-semibold">Total Amount</span>
            <div>
              <span className="text-2xl font-bold">
                ₹{totalAmount}
              </span>
              <button className="text-red-500 text-sm block">
                View Details
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <button
          className="w-full bg-red-500 text-white py-3 rounded-md hover:bg-red-600 transition-colors duration-300"
          onClick={
            verifiedUser && email
              ? makePayment
              : email
              ? handleVerify
              : handleLogin
          }
        >
          PROCEED TO PAY
        </button>
      </div>
    </div>
  );
};

export default ProceedSection;
