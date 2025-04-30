import React from 'react'
import {motion, AnimatePresence} from "framer-motion"

function Marquee() {
  return (
    <div data-scroll data-scroll-section data-scroll-speed=".1.5" className='w-full py-10 bg-[#004D43] rounded-tl-2xl rounded-tr-2xl'>
      <div className='text flex border-t-1 border-b-1 mt-15 border-[#1e8174] text-white whitespace-nowrap overflow-hidden mb-6 '>
        <motion.h1 initial={{x:"0"}} animate={{x:"-100%"}}  transition={{repeat:Infinity, ease:"linear", duration:15}} className='text text-[15vw] leading-none -mt-[3vw] py-2 font-[Founders Grotesk X-Condensed] font-bold tracking-tighter pr-7 uppercase'>Monitor Your Plants with US</motion.h1>
        <motion.h1 initial={{x:"0"}} animate={{x:"-100%"}}  transition={{repeat:Infinity, ease:"linear", duration:15}} className='text text-[15vw] leading-none -mt-[3vw] py-2 font-[Founders Grotesk X-Condensed] font-bold tracking-tighter uppercase'>Monitor Your Plants with US</motion.h1>
      </div>
    </div>
  )
}

export default Marquee