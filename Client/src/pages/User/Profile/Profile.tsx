import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../../components/User/Navbar/Navbar";
import "./Profile.css";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faUpload,
  faUser,
  faCircleXmark,
  faCircleCheck,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../slices/authSlice";
import { debounce } from "lodash";

const Profile: React.FC = () => {
  const [name, setName] = useState<string | null>("");
  const [dob, setDob] = useState<Date | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState<string | null>("");
  const [address, setAddress] = useState("");
  const [drivingId, setDrivingId] = useState("");
  const [drivingIdExp, setDrivingIdExp] = useState<Date | null>(null);
  const [previewFront, setPreviewFront] = useState<string | null>(null);
  const [previewBack, setPreviewBack] = useState<string | null>(null);
  const [drivingFront, setDrivingFront] = useState<File | null>(null);
  const [drivingBack, setDrivingBack] = useState<File | null>(null);

  const [onEdit, setOnEdit] = useState<boolean>(false);

  const navigate = useNavigate();

  const userName = useSelector((state: RootState) => state.auth.user);
  const userEmail = useSelector((state: RootState) => state.auth.email);
  const profileUpdated = useSelector(
    (state: RootState) => state.userDetails.profileUpdated
  );
  const status = useSelector((state: RootState) => state.userDetails.status);

  const userDob = useSelector((state: RootState) => state.userDetails.dob);
  const userPhone = useSelector((state: RootState) => state.userDetails.phone);
  const userAddress = useSelector(
    (state: RootState) => state.userDetails.address
  );
  const userDrivingId = useSelector(
    (state: RootState) => state.userDetails.drivingID
  );
  const userDrivingIdExp = useSelector(
    (state: RootState) => state.userDetails.drivingExpDate
  );
  const drivingPhotoFront = useSelector(
    (state: RootState) => state.userDetails.drivingIDFront
  );
  const drivingPhotoBack = useSelector(
    (state: RootState) => state.userDetails.drivingIDBack
  );

  const dispatch = useDispatch();

  const handleDebounce = debounce((date: Date | null, dateField) => {
    dateField === "dob" ? handleDob(date) : handleExpiryDate(date);
  }, 2000);

  const handleExpiryDate = (date: Date | null) => {
    if (!date) return;

    if (date < new Date()) {
      alert("Date must be future!");
      return;
    }

    setDrivingIdExp(date);
  };

  const handleDob = (date: Date | null) => {
    if (!date) return;

    const today = new Date();
    const birthDate = new Date(date);

    if (birthDate > today) {
      alert("please select correct date!");
      return;
    }

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      age < 18 ||
      (age === 18 && monthDifference < 0) ||
      (age === 18 &&
        monthDifference === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      alert("You must be 18 years or older!");
      return;
    }

    setDob(date);
  };

  const fileFrontInputRef = useRef<HTMLInputElement | null>(null);
  const fileBackInputRef = useRef<HTMLInputElement | null>(null);
  const objectURLFront = useRef<string | null>(null);
  const objectURLBack = useRef<string | null>(null);

  const frontButton = () => {
    if (fileFrontInputRef.current) {
      fileFrontInputRef.current.click();
    }
  };

  const backButton = () => {
    if (fileBackInputRef.current) {
      fileBackInputRef.current.click();
    }
  };

  const handleFrontImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setDrivingFront(file);
        if (objectURLFront.current) {
          URL.revokeObjectURL(objectURLFront.current);
        }
        const newObjectURL = URL.createObjectURL(file);
        objectURLFront.current = newObjectURL;
        setPreviewFront(URL.createObjectURL(file));
      } else {
        alert("Accepted only image file (JPEG/PNG) or PDF");
      }
    }
  };

  const handleBackImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

      if (allowedTypes.includes(file.type)) {
        setDrivingBack(file);
        if (objectURLBack.current) {
          URL.revokeObjectURL(objectURLBack.current);
        }
        const newObjectURL = URL.createObjectURL(file);
        objectURLBack.current = newObjectURL;
        setPreviewBack(newObjectURL);
      } else {
        alert("Accepted only image file (JPEG/PNG) or PDF");
      }
    }
  };

  const handleProfileSave = async (e: any) => {
    e.preventDefault();
    if (!dob) {
      alert("Provide your DOB!");
      return;
    }

    if (!phone.trim()) {
      alert("Provide phone number");
      return;
    }

    const phoneRegex = /^[+]?[\d\s-]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      alert("Provide valid phone number");
      return;
    }

    if (!address.trim()) {
      alert("please provide address");
      return;
    }

    if (!drivingId.trim()) {
      alert("please provide driving licence id");
      return;
    }

    if (!drivingIdExp) {
      alert("Please provide driving exp date!");
      return;
    }

    if (!drivingFront || !drivingBack) {
      alert("please upload driving licence front and back images!");
      return;
    }

    const formData = new FormData();

    const userInfo = {
      email,
      dob: dob.toISOString().split("T")[0],
      phone,
      address,
      drivingID: drivingId,
      drivingExpDate: drivingIdExp.toISOString().split("T")[0],
      drivingIDFront: drivingFront,
      drivingIDBack: drivingBack,
    };

    Object.entries(userInfo).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    try {
      await axios
        .post("http://localhost:3000/userprofile", formData)
        .then((res) => {
          if (res.data.userUpdated) {
            const profileUpdated = res.data.profileUpdated;
            const email = res.data.email;
            const userName = res.data.userName;
            const isHost = res.data.isHost;
            alert("Profile updated!");
            dispatch(
              setCredentials({ userName, email, isHost, profileUpdated })
            );
            navigate("/");
          }
        });
    } catch (error) {
      console.error("error on uploading userprofile data", error);
    }
  };

  useEffect(() => {
    setName(userName);
    setEmail(userEmail);
  }, [userName, userEmail]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8 mt-20">
          <div className="flex">
            <div className="w-1/4 pr-8 border-r border-gray-200">
              <ul className="space-y-4 text-gray-700 font-semibold">
                <li>Personal Details</li>
                <li>Orders</li>
                <li>Booking History</li>
              </ul>
            </div>

            <div className="w-3/4 pl-8">
              <div className="flex items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center relative">
                  <FontAwesomeIcon icon={faUser} className="text-3xl" />
                  <button className="absolute bottom-0 right-0 p-1 bg-white border rounded-full">
                    <span role="img" aria-label="edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                  </button>
                </div>
                <h2 className="ml-4 text-2xl font-bold text-gray-800">
                  {name}
                </h2>

                <div className="ml-auto">
                  <span
                    className={`text-sm font-semibold ${
                      status === "Not Verified"
                        ? `text-red-500`
                        : status === "Verification Pending"
                        ? `text-gray-500`
                        : `text-green-500`
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        status === "Not Verified"
                          ? faCircleXmark
                          : status === "Verification Pending"
                          ? faClock
                          : faCircleCheck
                      }
                    />
                    {status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border p-2 rounded"
                  type="text"
                  value={name}
                  placeholder={name ? name : ""}
                  disabled
                />
                <br />
                <DatePicker
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DOB"
                  selected={profileUpdated ? userDob : dob}
                  disabled={profileUpdated && !onEdit ? true : false}
                  onChange={(date: Date | null) => handleDebounce(date, "dob")}
                  className="border p-2 rounded z-auto relative w-full"
                />
                <input
                  className="border p-2 rounded"
                  type="tel"
                  placeholder="Phone Number"
                  value={profileUpdated ? userPhone : phone}
                  disabled={profileUpdated && !onEdit ? true : false}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <input
                  className="border p-2 rounded col-span-2"
                  type="email"
                  value={email}
                  placeholder={email ? email : ""}
                  disabled
                />
                <textarea
                  className="border p-2 rounded col-span-2"
                  placeholder={"Address"}
                  disabled={profileUpdated && !onEdit ? true : false}
                  value={profileUpdated ? userAddress : address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg text-gray-800">
                  Driving ID Information
                </h3>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    className="border p-2 rounded"
                    type="text"
                    placeholder="Driving Licence No."
                    value={profileUpdated ? userDrivingId : drivingId}
                    disabled={profileUpdated && !onEdit ? true : false}
                    onChange={(e) => setDrivingId(e.target.value)}
                  />
                  <DatePicker
                    dateFormat="dd-MM-yyyy"
                    placeholderText="Expiry Date"
                    selected={profileUpdated ? userDrivingIdExp : drivingIdExp}
                    disabled={profileUpdated && !onEdit ? true : false}
                    onChange={(date: Date | null) =>
                      handleDebounce(date, "expiryDate")
                    }
                    className="border p-2 rounded z-auto relative w-full"
                  />
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-lg text-gray-800">
                  Upload Driving ID Photo
                </h3>
                {!profileUpdated ? (
                  <div className="flex space-x-4 mt-4">
                    {previewFront ? (
                      <button
                        className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                        onClick={frontButton}
                      >
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={fileFrontInputRef}
                          onChange={handleFrontImage}
                        />
                        <img
                          src={previewFront}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ) : (
                      <button
                        className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center"
                        onClick={frontButton}
                      >
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={fileFrontInputRef}
                          onChange={handleFrontImage}
                        />
                        <span role="img" aria-label="upload">
                          <FontAwesomeIcon icon={faUpload} />
                        </span>
                        <p>Front</p>
                      </button>
                    )}

                    {previewBack ? (
                      <button
                        className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden"
                        onClick={backButton}
                      >
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={fileBackInputRef}
                          onChange={handleBackImage}
                        />
                        <img
                          src={previewBack}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </button>
                    ) : (
                      <button
                        className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center"
                        onClick={backButton}
                      >
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={fileBackInputRef}
                          onChange={handleBackImage}
                        />
                        <span role="img" aria-label="upload">
                          <FontAwesomeIcon icon={faUpload} />
                        </span>
                        <p>Back</p>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex space-x-4 mt-4">
                    <button className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden">
                      <img
                        src={`http://localhost:3000/${drivingPhotoFront}`}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </button>

                    <button className="flex-1 border-dashed border-2 border-gray-400 p-4 rounded text-center relative overflow-hidden">
                      <img
                        src={`http://localhost:3000/${drivingPhotoBack}`}
                        alt="Preview"
                        className="object-cover w-full h-full"
                      />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 flex justify-end">
                {!profileUpdated ? (
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
                    onClick={handleProfileSave}
                  >
                    SAVE
                  </button>
                ) : (
                  <button
                    className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-600"
                    onClick={() => setOnEdit(true)}
                  >
                    EDIT
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
