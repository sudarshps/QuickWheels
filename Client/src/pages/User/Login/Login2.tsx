import React,{useState} from 'react'
import Modal from '../../../components/User/Login Modal/loginModal'
import Navbar from '../../../components/User/Navbar/Navbar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AppDispatch } from "../../../redux/store";


const Login2:React.FC = () => {

    const [openModal,setOpenModal] = useState(false)
    const [email, setEmail] = useState("");
    const [login, setLogin] = useState<boolean | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [invalidMsg, setInvalidMsg] = useState("");
    const [loginError, setLoginError] = useState("");


    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
  
    axios.defaults.withCredentials = true;
  
  
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
          userId:string;
          token:string;
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
                
                const token = userRegistration.data.token
                setOpenModal(false)
                // navigate(`/?username=${userName}`)
                localStorage.setItem('token',token)
                navigate('/')   
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
      token:string;
      username:string;
      userId:string;
      message:string;
    }

    try {

      const userResponse = await axios.post<response>(
        "http://localhost:3000/userLogin",
        {email,password}
      )

      // const userResponse = await loginin({email,password}).unwrap()

      if(userResponse.data.validUser){
          // navigate(`/?username=${userResponse.data.username}`)            
          // const token = userResponse.data.token
          // const userName = userResponse.data.username
          // localStorage.setItem('token',token)
          // localStorage.setItem('username',userName)
          
          // dispatch(setCredentials({userName,accessToken:token}))

          navigate('/')
          
      }else{
        setLoginError('Incorrect Password!')
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
      <Navbar />
      <div className={`main-div relative ${openModal?'blur-sm':''}`}>
    <div className="font-[sans-serif] bg-gray-50">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 items-center lg:gap-10 gap-4">
        <div className="max-md:order-1 h-screen min-h-full">
          <img src="https://readymadeui.com/image-3.webp" className="w-full h-full object-cover" alt="login-image" />
        </div>

        <form className="lg:col-span-2 max-w-lg w-full p-6 mx-auto">
          <div className="mb-12">
            <h3 className="text-gray-800 text-4xl font-extrabold">Sign in</h3>
            <p className="text-gray-800 text-sm mt-6">Don't have an account <a href="javascript:void(0);" className="text-blue-600 font-semibold hover:underline ml-1 whitespace-nowrap">Register here</a></p>
          </div>

          <div>
            <label className="text-gray-800 text-sm block mb-2">Email</label>
            <div className="relative flex items-center">
              <input name="email" type="text" required className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter email" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2" viewBox="0 0 682.667 682.667">
                <defs>
                  <clipPath id="a" clipPathUnits="userSpaceOnUse">
                    <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                  </clipPath>
                </defs>
                <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                  <path fill="none" stroke-miterlimit="10" stroke-width="40" d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z" data-original="#000000"></path>
                  <path d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z" data-original="#000000"></path>
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-8">
            <label className="text-gray-800 text-sm block mb-2">Password</label>
            <div className="relative flex items-center">
              <input name="password" type="password" required className="bg-transparent w-full text-sm text-gray-800 border-b border-gray-300 focus:border-blue-600 px-2 py-3 outline-none" placeholder="Enter password" />
              <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" className="w-[18px] h-[18px] absolute right-2 cursor-pointer" viewBox="0 0 128 128">
                <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
              </svg>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label className="text-gray-800 ml-3 block text-sm">
                Remember me
              </label>
            </div>
            <div>
              <a href="jajvascript:void(0);" className="text-blue-600 text-sm font-semibold hover:underline">
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="mt-8">
            <button type="button" className="w-full py-2.5 px-5 text-sm tracking-wide rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
              Sign in
            </button>
          </div>

          <div className="my-4 flex items-center gap-4">
            <hr className="w-full border-gray-300" />
            <p className="text-sm text-gray-800 text-center">or</p>
            <hr className="w-full border-gray-300" />
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-4 py-2.5 px-5 text-sm tracking-wide text-gray-800 border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20px" className="inline" viewBox="0 0 512 512">
              <path fill="#fbbd00"
                d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                data-original="#fbbd00" />
              <path fill="#0f9d58"
                d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                data-original="#0f9d58" />
              <path fill="#31aa52"
                d="m139.131 325.477-86.308 86.308a260.085 260.085 0 0 0 22.158 25.235C123.333 485.371 187.62 512 256 512V392c-49.624 0-93.117-26.72-116.869-66.523z"
                data-original="#31aa52" />
              <path fill="#3c79e6"
                d="M512 256a258.24 258.24 0 0 0-4.192-46.377l-2.251-12.299H256v120h121.452a135.385 135.385 0 0 1-51.884 55.638l86.216 86.216a260.085 260.085 0 0 0 25.235-22.158C485.371 388.667 512 324.38 512 256z"
                data-original="#3c79e6" />
              <path fill="#cf2d48"
                d="m352.167 159.833 10.606 10.606 84.853-84.852-10.606-10.606C388.668 26.629 324.381 0 256 0l-60 60 60 60c36.326 0 70.479 14.146 96.167 39.833z"
                data-original="#cf2d48" />
              <path fill="#eb4132"
                d="M256 120V0C187.62 0 123.333 26.629 74.98 74.98a259.849 259.849 0 0 0-22.158 25.235l86.308 86.308C162.883 146.72 206.376 120 256 120z"
                data-original="#eb4132" />
            </svg>
            Continue with google
          </button>
        </form>
      </div>
    </div>
    </div>
    </>
  )
}

export default Login2