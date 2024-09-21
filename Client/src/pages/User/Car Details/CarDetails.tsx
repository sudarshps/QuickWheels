import React from 'react'
import Navbar from '../../../components/User/Navbar/Navbar'
import CarDetailsSection from './components/CarDetailsSection'
import ProceedSection from './components/ProceedSection'

const CarDetails:React.FC = () => {
  return (
    <>
      <Navbar className='top-0'/>
      <div className="flex flex-col lg:flex-row gap-8 mt-24 mx-16 p-4">
        <CarDetailsSection/>
        <ProceedSection/>
      </div>

    </>
  )
}

export default CarDetails
