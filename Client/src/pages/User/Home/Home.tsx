import React, { useEffect, useState } from "react";
import Navbar from "../../../components/User/Navbar/Navbar.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import NavigationMenu from "./components/NavigationMenu.tsx";
import LocationUI from "./components/LocationUI.tsx";
import { DatePickerWithRange } from "../../../components/ui/daterangepicker.tsx";
import { DateRange } from "react-day-picker";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const handleLocation = (data: string) => {
    setLocation(data);
  };

  const handleDateChange = (date: DateRange | undefined) => {
    setDate(date);
  };

  const handleBookButton = () => {
    if (!date) {
      alert("select dates!");
      return;
    }
    navigate("/availablecars");
  };

  // useEffect(()=>{
  //   if(date){
  //     sessionStorage.setItem('date',JSON.stringify(date))
  //   }
  // },[date])

  useEffect(() => {
    if (date && date.from && date.to) {
      // Convert the dates to local time instead of UTC
      const fromLocalTime = new Date(
        date.from.getTime() - date.from.getTimezoneOffset() * 60000
      ).toISOString();

      const toLocalTime = new Date(
        date.to.getTime() - date.to.getTimezoneOffset() * 60000
      ).toISOString();

      const formattedDate = {
        from: fromLocalTime,
        to: toLocalTime,
      };

      sessionStorage.setItem("date", JSON.stringify(formattedDate));
    }
  }, [date]);

  useEffect(() => {
    const storedLocation = sessionStorage.getItem("userlocation");
    if (!storedLocation) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            sessionStorage.setItem(
              "userlocation",
              JSON.stringify({ lng, lat })
            );
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-page relative">
        <div className="content-1 flex-none absolute top-20 mt-8 left-20">
          <h1 className="text-3xl font-bold">
            Enjoy Your Ride With
            <br />
            Our Best Service
          </h1>
          <p className="text-xs text-gray-500 pt-6">
            We provide you the best service. Discover a seamless car rental
            <br /> experience that puts you in the driver’s seat.
            <br />
            Whether you're planning a quick city getaway or an epic road trip,
            <br /> we have the perfect vehicle to meet your needs. <br />
            Choose from our wide range of cars,
            <br /> from compact city cars to spacious SUVs and luxury models.
          </p>
          {/* <button className="text-red-500 border border-red-500 mt-8 font-medium py-1 px-3 rounded hover:border-orange-500 hover:text-orange-500">
            Rent Your Car
          </button> */}
          <div className="bg-white shadow-lg rounded-lg space-y-4 mt-6 items-center justify-between p-4 w-72 sm:w-full max-w-7xl mx-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto mb-4 md:mb-0">
                <FontAwesomeIcon
                  icon={faLocationArrow}
                  className="text-red-500"
                />
                <section className="border-none focus:ring-0 cursor-pointer text-sm text-gray-600 w-40 md:w-60">
                  <NavigationMenu
                    heading={
                      location.trim() ? location.slice(0,30) : "Location"
                    }
                    UI={<LocationUI getLocation={handleLocation} />}
                  />
                </section>
              </div>

              <div className="w-full md:w-auto md:px-4 mb-4 md:mb-0">
                <DatePickerWithRange onDateChange={handleDateChange} />
              </div>
            <div className="w-full md:w-auto md:px-4">
              <button
                className="bg-red-500 text-white text-sm px-16 py-2 w-full md:w-auto rounded-lg hover:bg-red-600"
                onClick={handleBookButton}
              >
                Book Your Ride
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
