import React from 'react'
import { Pagination as PaginationMain,
    PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
 } from '../ui/pagination'
  

const Pagination:React.FC = ({textColor,prev,next,startIndex,endIndex,dataLength}) => {

  const pages = Math.ceil(dataLength/10)*10/5
  

  return (
      <PaginationMain className={textColor}>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" onClick={prev} className={startIndex===0?'pointer-events-none opacity-50':undefined}/>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" size={pages}>1</PaginationLink>
    </PaginationItem>   
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" onClick={next} className={endIndex===Math.ceil(dataLength/10)*10?'pointer-events-none opacity-50':undefined}/>
    </PaginationItem>
  </PaginationContent>
</PaginationMain>

    
  )
}

export default Pagination
