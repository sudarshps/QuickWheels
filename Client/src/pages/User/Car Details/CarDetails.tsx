import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import CarDetailsSection from "./components/CarDetailsSection";
import ProceedSection from "./components/ProceedSection";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

const CarDetails: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");


  const [carImages, setCarImages] = useState<string[]>([]);
  const [make, setMake] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuel, setFuel] = useState("");
  const [seat, setSeat] = useState("");
  const [features,setFeatures] = useState([])
  const [hostName, setHostName] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/cardetails", {
        params: {
          id
        },
      })
      .then((res) => {        
        setCarImages(res.data.images);
        setAddress(res.data.address)
        setMake(res.data.carMake[0].name);
        setType(res.data.carType[0].name);
        setModel(res.data.carModel);
        setTransmission(res.data.transmission);
        setFuel(res.data.fuel);
        setFeatures(res.data.features)
        setSeat(res.data.seatCapacity);
        setHostName(res.data.userDetails[0].name);
        setAmount(res.data.rentAmount)
      });
  }, [id]);

  
  return (
    <>
      <Navbar className="top-0" />
      <div className="flex flex-col lg:flex-row gap-8 mt-24 mx-16 p-4">
        <CarDetailsSection
          carImages={carImages}
          make={make}
          type={type}
          model={model}
          transmission={transmission}
          fuel={fuel}
          seat={seat}
          hostName={hostName}
          address={address}
          features={features}
        />
        <ProceedSection amount={amount} carId={id}/>
      </div>
    </>
  );
};

export default CarDetails;
