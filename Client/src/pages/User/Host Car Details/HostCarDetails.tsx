import React from 'react'
import Navbar from '../../../components/User/Navbar/Navbar'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const CarDetails:React.FC = () => {
  return (
    <>
      <Navbar/>
      <div className="flex flex-col userprofile items-center py-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8 mt-20">
      <div>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Car Details</h2>

        </AccordionSummary>
        <AccordionDetails>
          
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Car Documents</h2>

        </AccordionSummary>
        <AccordionDetails>
          
        </AccordionDetails>
      </Accordion>
    </div>
            </div>
      </div>
    </>
  )
}

export default CarDetails
