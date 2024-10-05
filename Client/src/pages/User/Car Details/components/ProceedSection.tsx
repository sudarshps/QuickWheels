import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { useNavigate } from "react-router-dom";

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

  const email = useSelector((state: RootState) => state.auth.email);
  const verifiedUser = useSelector(
    (state: RootState) => state.userDetails.verifiedUser
  );
  const navigate = useNavigate();

  const handleLogin = () => {
    alert("please login to continue");
    navigate("/login");
  };

  const handleVerify = () => {
    alert("please verify your profile to proceed");
    navigate("/profile");
  };
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
                ₹{selectedHours * amount + 1500}
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
            verifiedUser
              ? () => navigate("/payment")
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
