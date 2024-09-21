import React from "react";
import { useNavigate } from "react-router-dom";

const CarListSection: React.FC = ({carListings}) => {
  
  const navigate = useNavigate();


  return (
    <>
      <section className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {carListings.length ? (
          carListings.map((car, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md h-80 overflow-hidden hover:cursor-pointer"
              onClick={() => navigate(`/cardetails?id=${car._id}`)}
            >
              <img
                src={`http://localhost:3000/${car.images[0]}`}
                alt={car.carModel}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{car.carModel}</h2>
                <p className="text-gray-600 mb-2">
                  {car.transmission} · {car.fuel} · {car.seatCapacity}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    ₹{car.rentAmount}/hr
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2>No cars to show!</h2>
        )}
      </section>
    </>
  );
};

export default CarListSection;
