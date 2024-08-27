import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser} from '@fortawesome/free-solid-svg-icons'

interface NavbarProps {
  username:string;
}

const Navbar: React.FC<NavbarProps> = ({username}) => {

    const [isMenuOpen,setIsMenuOpen] = useState(false)
    const[user,setUser] = useState('')

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const navigate = useNavigate()

    const signIn = () => {
      navigate('/login')
    }

    useEffect(()=>{
      const userName = sessionStorage.getItem('username')
      if(userName){
        setUser(userName)
      }
    },[])
    

  return (
       <nav className="bg-transparent p-4 fixed w-full z-50"> 
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-12 p-4">
        <Link to="http://localhost:5173/" className="flex items-center rtl:space-x-reverse">
          <span className="Logo-Quick py-1 px-1 self-center text-xl font-bold whitespace-nowrap dark:text-white rounded-md italic">Quick</span>
          <span className="self-center text-lg font-bold whitespace-nowrap dark:text-white italic">Wheels</span>
        </Link>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className={`font-medium flex flex-col p-4 md:p-0 mt-4 items-center rounded-lg border md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700 ${isMenuOpen?'bg-gray-50 dark:bg-gray-800':''}`}>
            <li>
              <Link to="/" className="block py-2 px-3 text-white bg-red-500 rounded md:bg-transparent md:text-red-600 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Home</Link>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">About Us</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Services</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-red-600 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Contact Us</a>
            </li>
            <li>
              {user?<FontAwesomeIcon icon={faUser} style={{cursor:'pointer'}} className='md:hover:text-red-600'/>:<button className="block bg-red-600 text-white font-medium py-1 px-3 rounded hover:text-black" onClick={signIn}>Sign In</button>}
              {/* <button className="block bg-red-600 text-white font-medium py-1 px-3 rounded hover:text-black" onClick={signIn}>Sign In</button> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
