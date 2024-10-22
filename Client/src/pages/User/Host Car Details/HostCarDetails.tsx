import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { useSearchParams } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const CarDetails: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [carDetails, setCarDetails] = useState<object | null>(null);
  const [carMake, setCarMake] = useState([]);
  const [carType, setCarType] = useState([]);
  const [selectedCarMake, setSelectedCarMake] = useState(carDetails?.carMake[0]._id);
  const [carModel, setCarModel] = useState(carDetails?.carModel);
  const [rentAmount, setRentAmount] = useState(carDetails?.rentAmount);
  const [seatCapacity, setSeatCapacity] = useState(carDetails?.seatCapacity);
  const [fuel, setFuel] = useState(carDetails?.fuel);
  const [transmission, setTransmission] = useState(carDetails?.transmission);
  const [selectedCarType, setSelectedCarType] = useState(carDetails?.carType[0]._id);
  const [changes,setChanges] = useState(false)
  useEffect(() => {
    axiosInstance
      .get("/cardetails", {
        params: { id },
      })
      .then((res) => {
        if (res.data) {
          setCarDetails(res.data);
        }
      });

    axiosInstance.get("/getcarmake").then((res) => {
      if (res.data) {
        setCarMake(res.data);
      }
    });

    axiosInstance.get("/getcartype").then((res) => {
      if (res.data) {
        setCarType(res.data);
      }
    });

    if (
      carDetails?.carMake[0]._id !== selectedCarMake ||
      carDetails?.carModel !== carModel ||
      carDetails?.rentAmount !== rentAmount ||
      carDetails?.seatCapacity !== seatCapacity ||
      carDetails?.fuel !== fuel ||
      carDetails?.transmission !== transmission ||
      carDetails?.carType[0]._id !== selectedCarType
    ) {
      setChanges(false)
    } else {
      setChanges(true)
    }
  }, [
    id,
    selectedCarMake,
    carModel,
    rentAmount,
    seatCapacity,
    fuel,
    transmission,
    selectedCarType,
  ]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8 mt-20">
          <div>
            <Tabs defaultValue="account" className="w-[400px]">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-6 mt-10">
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carMake"
                    >
                      Make<span className="text-red-500">*</span>
                    </label>

                    <select
                      className="w-full p-2 border rounded"
                      value={selectedCarMake}
                      onChange={(e) => setSelectedCarMake(e.target.value)}
                    >
                      <option value={carDetails?.carMake[0]._id}>
                        {carDetails?.carMake[0].name}
                      </option>

                      {carMake.map((make, ind) => (
                        <option key={ind} value={make._id}>
                          {make.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="carModel"
                    >
                      Model<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="carModel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={carDetails?.carModel}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="year"
                    >
                      Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={selectedCarType}
                      onChange={(e) => setSelectedCarType(e.target.value)}
                      name="options"
                    >
                      <option value={carDetails?.carType[0]._id}>
                        {carDetails?.carType[0].name}
                      </option>
                      {carType.map((type, ind) => (
                        <option key={ind} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="year"
                    >
                      Transmission<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      name="options"
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="fueltype"
                    >
                      Fuel Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      className="w-full p-2 border rounded"
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value)}
                      name="options"
                    >
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="EV">EV</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="seatcapacity"
                    >
                      Seat Capacity<span className="text-red-500">*</span>
                    </label>
                    <select
                      id="options"
                      value={seatCapacity}
                      onChange={(e) => setSeatCapacity(e.target.value)}
                      className="w-full p-2 border rounded"
                      name="options"
                    >
                      <option value="4-5 Seater">4-5 Seater</option>
                      <option value="6-7 Seater">6-7 Seater</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      htmlFor="rentamount"
                    >
                      Rent Amount<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="rentAmount"
                      value={rentAmount}
                      onChange={(e) => setRentAmount(e.target.value)}
                      className="w-full p-2 border rounded mb-2"
                      placeholder={carDetails?.rentAmount}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className={`px-2 py-2 bg-yellow-500 rounded text-white ${changes?`disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50`:``}`}
                    disabled={changes}
                    // onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </TabsContent>
              <TabsContent value="document">
                Change your password here.
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarDetails;
