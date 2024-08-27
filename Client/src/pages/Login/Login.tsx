import React, { useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import LoginImage from "../../assets/carlogin.jpg";
import GoogleLogo from "../../assets/icons8-google.svg";
import FbLogo from "../../assets/icons8-facebook.svg";
import Modal from '../../components/Login Modal/loginModal'
import { useNavigate } from "react-router-dom";



const Login: React.FC = () => {
  const [step,setStep] = useState(1)
  const [openModal,setOpenModal] = useState(false)
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [invalidMsg, setInvalidMsg] = useState("");

  const navigate = useNavigate()

  const checkEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("provide correct email");
      return;
    }

    interface CheckEmailRequest {
      email: string;
    }

    interface CheckEmailResponse {
      emailExists: Boolean;
      message: string;
    }

    const requestData: CheckEmailRequest = { email };

    try {
      const response = await axios.post<CheckEmailResponse>(
        "http://localhost:3000/checkMail",
        requestData
      );

      const { emailExists } = response.data;

      if (emailExists) {
        setLogin(true);
      } else {
        setLogin(false);
      }
    } catch (error) {
      console.error("Error on user mail checking", error);
    }
  };


  const requestOtp = async() => {

    interface mail {
      email: string;
    }

    const requestData: mail = { email };

    interface otpResponse {
      otpSent: Boolean;
      message: string;
    }

    if(!userName.trim()){
      alert('provide a username')
      return
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


    if(!password.trim()){
      alert('provide a password')
      return
    }

    if(!passwordRegex.test(password)){
      alert('password should be strong')
      return
    }

    try {
      const response = await axios.post<otpResponse>(
        "http://localhost:3000/sentOtp",
        requestData
      );

      if(response.data.otpSent){
          setOpenModal(true)
      }
      
    } catch (error) {
      console.error('error in request otp')
    }

  }

  const verifyOtp = async(otp:string) => {
        interface otpResponse {
          validOtp: Boolean;
          message: string;
        }

        interface userResponse {
          userCreated:Boolean;
           message:string;
        }

        try {
          const response = await axios.post<otpResponse>(
            "http://localhost:3000/verifyOtp",
            {otp,emailToVerify:email}
          )
          
          if(response.data.validOtp){
            
              const userRegistration = await axios.post<userResponse>(
                "http://localhost:3000/userRegister",
                {userName,password,email}
              )
              
              if(userRegistration.data.userCreated){
                setOpenModal(false)
                navigate(`/?username=${userName}`)
              }
              
          }else{
            setInvalidMsg('Invalid Otp!')
            
          }
        } catch (error) {
          console.error('error in verifying otp')
        }
  } 


  const userLogin = async() => {
      interface response{
        validUser:boolean;
        username:string;
        message:string
      }

      try {
        const userResponse = await axios.post<response>(
          "http://localhost:3000/userLogin",
          {email,password}
        )

        if(userResponse.data.validUser){
            navigate(`/?username=${userResponse.data.username}`)
        }
      } catch (error) {
        console.error('error in login',error)
      }
  }

  const googleSignIn = () =>{
    window.location.href = 'http://localhost:3000/auth';
  }

  return (
    <>
    <Modal isOpen={openModal} onClose={()=>setOpenModal(false)} onVerify={verifyOtp} onResend={requestOtp} invalidMessage={invalidMsg}>
        <></>
      </Modal>
      <Navbar username={''}/>
      <div className={`main-div relative ${openModal?'blur-sm':''}`}>
        <div className="login-card absolute top-60 left-1/2 ml-28 transform -translate-x-1/2 -translate-y-1/2 flex flex-col md:flex-row w-full md:w-3/4 h-44 md:h-64">
          <div
            className={`image-container hidden md:block w-full md:w-1/4 ${login===false || login===true?`md:h-[500px]`:`md:h-80`} bg-gray-200 bg-cover bg-center shadow-md rounded`}
            style={{ backgroundImage: `url(${LoginImage})` }}
          ></div>

          <div className={`w-3/4 justify-center md:w-1/2 ${login===false || login===true?`md:h-[500px]`:`md:h-80`} flex bg-red-100 p-4 shadow-md rounded`}>
            <div className="login-form flex-none">
              <h1 className="text-sm font-bold text-center md:text-left">
                {login === false
                  ? "Create Account"
                  : login === true
                  ? "Sign In"
                  : login === null
                  ? "Sign In or Create Account"
                  : ""}
              </h1>
              <div className="email-field mt-8 w-full">
                <p className="text-sm font-semibold">Enter Email</p>
                <input
                  type="text"
                  className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                disabled={login===false}/>
              </div>
              {login === false ? (
                <div className="username-field mt-8 w-full">
                  <p className="text-sm font-semibold">Enter Username</p>
                  <input
                    type="text"
                    className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
              ) : (
                ""
              )}
              {login === true || login === false ? (
                <div className="password-field mt-8 w-full">
                  <p className="text-sm font-semibold">Enter Password</p>
                  <input
                    type="text"
                    className="border shadow-md rounded w-full md:w-64 mt-2 p-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              ) : (
                ""
              )}
              <button
                className="mt-8 w-full md:ml-16 md:w-32 bg-red-500 rounded p-1 font-semibold text-white"
                onClick={login === false
                  ? requestOtp
                  : login === true
                  ? userLogin
                  : login === null
                  ? checkEmail
                  : undefined}
              >
                {login === false
                  ? "Request OTP"
                  : login === true
                  ? "Sign In"
                  : login === null
                  ? "Continue"
                  : ""}
              </button>
              <hr className="border-gray-500 my-8" />

              <div className="social-sign flex space-x-4 ml-5">
                <div onClick={googleSignIn} className="social-sign flex items-center space-x-2 w-24 h-10 p-1 bg-white rounded justify-center hover:cursor-pointer">
                  <img src={GoogleLogo} alt="Google logo" className="w-5 h-5" />
                  <h1 className="text-sm font-semibold">Sign In</h1>
                </div>

                <div className="social-sign flex items-center space-x-2 w-24 h-10 p-1 bg-white rounded justify-center hover:cursor-pointer">
                  <img src={FbLogo} alt="Google logo" className="w-5 h-5" />
                  <h1 className="text-sm font-semibold">Sign In</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
