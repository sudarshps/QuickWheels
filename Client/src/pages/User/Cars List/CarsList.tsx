import React, { useState,useEffect } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import FilterSection from "./Components/FilterSection";
import CarListSection from "./Components/CarListSection";
import SearchSection from "./Components/SearchSection";
import axios from "axios";


interface CarDetailsType {
  _id: string;
  images: string[];
  carModel: string;
  transmission: string;
  fuel: string;
  seatCapacity: string;
  rentAmount: string;
}

const CarsList: React.FC = () => { 

  const[sort,setSort] = useState('')
  const[transmission,setTransmission] = useState<string[]>([])
  const[fuel,setFuel] = useState<string[]>([])
  const[seat,setSeat] = useState<string[]>([])
  const [carListings, setCarListings] = useState<CarDetailsType[]>([]);
  
  const handleSortChange = (sort:string,transmission:string[],fuel:string[],seat:string[]) => {    
      setSort(sort)
      setTransmission(transmission)
      setFuel(fuel)
      setSeat(seat)
  }

  useEffect(() => {
    axios
      .get("http://localhost:3000/getrentcardetails", {
        params:{
          sort,transmission,fuel,seat
        }
      })
      .then((res) => {
        setCarListings(res.data);
      });
  }, [sort,transmission,fuel,seat]);

  

  return (
    <>
      <Navbar className="top-0" />
      <main className="container mx-auto px-4 py-8 mt-24">
        <SearchSection/>
        {/* <div className="flex flex-col md:flex-row justify-between mx-12 p-4 items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="font-semibold">Date</span>
            <div className="relative">
              <FontAwesomeIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                icon={faCalendar}
              />
              <input
                type="text"
                placeholder="From"
                className="pl-10 pr-4 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                icon={faCalendar}
              />
              <input
                type="text"
                placeholder="To"
                className="pl-10 pr-4 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </div>
          
        </div> */}

        <div className="flex flex-col md:flex-row mx-12 p-4">
          <FilterSection onSortChange={handleSortChange}/>
          <CarListSection carListings={carListings}/>
        </div>
      </main>
    </>
  );
};

export default CarsList;
