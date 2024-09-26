import React, { useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow,faSearch,faCalendar } from "@fortawesome/free-solid-svg-icons";

const SearchSection:React.FC = () => {

    const[searchValue,setSearchValue] = useState('')

    const handleSearch = () => {

    }

    const getUserLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
  
            sessionStorage.setItem('userlocation',JSON.stringify({lng,lat}))
            console.log(`Latitude: ${lat}, longitude: ${lng}`);
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };


  return (
    <>
      <div className="w-full bg-red-100">
        <div className="flex flex-col md:flex-row mx-12 p-4 items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <FontAwesomeIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-500"
              icon={faLocationArrow}
            />
            <select className="w-1/2 pl-10 pr-4 py-2 border border-red-300 rounded-md focus:ring-1 focus:ring-red-500" onChange={(e) => {
                  if (e.target.value === "current location") {
                    getUserLocation();
                  }
                }}>
              <option>Choose Location</option>
              <option value='current location'>Current Location</option>
            </select>
          </div>
          <div className="relative flex-grow">
            <FontAwesomeIcon
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              icon={faSearch}
            />
            <input
              type="text"
              placeholder="Search for models, features, etc..."
              value={searchValue}
              onChange={(e)=>setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <button onClick={handleSearch} className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-500 transition-colors duration-300">
            Search
          </button>
        </div>
        </div>
    </>
  )
}

export default SearchSection
