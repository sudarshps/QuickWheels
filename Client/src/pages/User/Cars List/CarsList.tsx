import React, { useState,useEffect } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import FilterSection from "./Components/FilterSection";
import CarListSection from "./Components/CarListSection";
import SearchSection from "./Components/SearchSection";
import axiosInstance from "../../../api/axiosInstance";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface CarDetailsType {
  _id: string;
  images: string[];
  carModel: string;
  transmission: string;
  fuel: string;
  seatCapacity: string;
  rentAmount: string;
  distance:number
}

const CarsList: React.FC = () => { 

  const[sort,setSort] = useState('')
  const[transmission,setTransmission] = useState<string[]>([])
  const[fuel,setFuel] = useState<string[]>([])
  const[seat,setSeat] = useState<string[]>([]) 
  const[distance,setDistance] = useState<string[]>(['0']) 
  const [carListings, setCarListings] = useState<CarDetailsType[]>([]);
  const [searchValue,setSearchValue] = useState('')
  const [carType,setCarType] = useState<string[]>([])
  const [carMake,setCarMake] = useState('')

  const[userSearch,setUserSearch] = useState('')
  
  const userId = useSelector((state: RootState) => state.auth.userId)
  
  const handleSortChange = (sort:string,transmission:string[],fuel:string[],seat:string[],distance:string[],search:string,carType:string[],carMake:string) => {    
      setSort(sort)
      setTransmission(transmission)
      setFuel(fuel)
      setSeat(seat)
      setDistance(distance)
      setUserSearch(search)
      setCarType(carType)
      setCarMake(carMake)
  }
  

  const handleSearch = (input:string) =>{
    setSearchValue(input)
  }
  
  useEffect(() => {
    let lng = 0
    let lat = 0
    let dateFrom = null
    let dateTo = null
    if(sessionStorage.getItem('userlocation')){
      const coordinates = JSON.parse(sessionStorage.getItem('userlocation'))
      lng = coordinates.lng
      lat = coordinates.lat  
    }

    if(sessionStorage.getItem('date')){
      const storedDate = sessionStorage.getItem('date')
      const parsedDate = JSON.parse(storedDate)
      dateFrom = new Date(parsedDate.from)
      dateTo = new Date(parsedDate.to)

    }
    
    axiosInstance
      .get("/getrentcardetails", {
        params:{
          sort,transmission,fuel,seat,distance,userSearch,lng,lat,carType,carMake,
          dateFrom,dateTo,userId
        }
      })
      .then((res) => {
        setCarListings(res.data);
      });
  }, [sort,transmission,fuel,seat,distance,userSearch,carType,carMake,userId]);

  

  

  return (
    <>
      <Navbar className="top-0" />
      <main className="container mx-auto px-4 py-8 mt-24">
      <SearchSection onSearch={handleSearch}/>

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
          <FilterSection onSortChange={handleSortChange} search={searchValue}/>
          <CarListSection carListings={carListings}/>
        </div>
      </main>
    </>
  );
};

export default CarsList;
