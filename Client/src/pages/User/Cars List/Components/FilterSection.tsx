import React, { useState } from "react";
import { TooltipDemo } from "./Tooltip";
interface FilterSectionProps {
  onSortChange: (
    sort: string,
    transmission: string[],
    fuel: string[],
    seat: string[],
    distance:number[]
  ) => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({ onSortChange }) => {
  const [transmission, setTransmission] = useState<string[]>([]);
  const [fuel, setFuel] = useState<string[]>([]);
  const [seat, setSeat] = useState<string[]>([]);
  const [sort, setSort] = useState("Relevance");
  const [distance,setDistance] = useState([0])
  

  const handleTransmission = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setTransmission([...transmission, value]);
    } else {
      setTransmission(transmission.filter((item) => item !== value));
    }
  };

  const handleFuelType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setFuel([...fuel, value]);
    } else {
      setFuel(fuel.filter((item) => item !== value));
    }
  };

  const handleSeatType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setSeat([...seat, value]);
    } else {
      setSeat(seat.filter((item) => item !== value));
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
  };

  const handleDistanceChange = (value:number[]) =>{
    setDistance(value)
  }



  return (
    <>
      <aside className="w-full md:w-1/4 pr-8">
        <div className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md mb-4">
          Filters
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Sort By</h3>
            <div className="flex items-center">
              <select
                onChange={handleSortChange}
                className="pl-3 pr-20 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option>Relevance</option>
                <option value="lowtohigh">Price: Low to High</option>
                <option value="hightolow">Price: High to Low</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Distance</h3>
            <TooltipDemo onDistanceChange={handleDistanceChange}/>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Delivery Type</h3>
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox text-red-500" />
              <span className="ml-2">Home Delivery</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Additional delivery charges applicable
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Car Details</h3>
            <h4 className="text-sm text-gray-600 mb-1">
              Filter by Transmission
            </h4>
            {["Manual", "Automatic"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleTransmission}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-1">Filter by Fuel Type</h4>
            {["Petrol", "Diesel", "EV"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleFuelType}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <h4 className="text-sm text-gray-600 mb-1">
              Filter by Seat Capacity
            </h4>
            {["4-5 Seater", "6-7 Seater"].map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  value={type}
                  onChange={handleSeatType}
                  className="form-checkbox text-red-500"
                />
                <span className="ml-2">{type}</span>
              </label>
            ))}
          </div>

          <div>
            <button
              className="bg-red-500 text-white px-20 py-2 rounded-md hover:bg-red-600 transition-colors duration-100 whitespace-nowrap"
              onClick={() => onSortChange(sort, transmission, fuel, seat, distance)}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default FilterSection;
