import React from 'react'
import { motion } from 'framer-motion'

function Hero() {
  return (
    <div data-scroll data-scroll-section data-scroll-speed="-.1" className='h-dvh w-full bg-[url("/img/img1.jpg")] bg-cover bg-no-repeat bg-center'>
      <div className='textstructure '>
        {["We help", "You Monitor", "your plants"].map((item, index) => {
            return <div className='masker'>
                      <div className='w-fit flex items-end scale-x-88'>
                        {index === 0 && (
                          <h1 className='ml-[1vw] mt-60'></h1>
                        )}
                        {index === 1 && (
                          <motion.div initial={{width: 0}} animate={{width: "11vw"}} transition={{ease: [0.76 , 0, 0.24, 1] , duration:1}} className=' mr-[1vw] w-[11vw] rounded-md h-[6.2vw]  relative bg-[url("img/img2.jpeg")] bg-cover bg-center'></motion.div>
                        )}
                          <h1 className='transform scale-y-120 text-[8vw] leading-[7.3vw] tracking-[-0.06em] uppercase font-bold font-["Founders Grotesk X-Condensed"]'>{item}</h1>
                        </div> 
                    </div>
        })}
      </div>
    </div>
  )
}

export default Hero
