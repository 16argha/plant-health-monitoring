import React from 'react'
// Import images directly (adjust paths as needed)
import moistureImg from '../img/moisture.jpg'
import tempImg from '../img/temp.jpeg'
import humidityImg from '../img/humidity.jpeg'

function PlantHealth() {
  return (
    <div data-scroll data-scroll-section data-scroll-speed="-.2.4" className='h-dvh w-full '>
        <h1 className='px-15 mt-30 text-xl font-[Gilroy]'> Here is a brief information about your plant health data that is being monitored by us :</h1>
        <div className='flex gap-3 mt-15 px-10'>
            <div 
                className='h-1/2 w-1/3 border rounded-xl flex items-center justify-center'
                style={{
                backgroundImage: `url(${moistureImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px'
                }}
            >
                <p className="bg-black/50 text-white p-2 rounded">Moisture</p>
            </div>
            
            <div 
                className='h-1/2 w-1/3 border rounded-xl flex items-center justify-center'
                style={{
                backgroundImage: `url(${tempImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px'
                }}
            >
                <p className="bg-black/50 text-white p-2 rounded">Temperature</p>
            </div>
            
            <div 
                className='h-1/2 w-1/3 border rounded-xl flex items-center justify-center'
                style={{
                backgroundImage: `url(${humidityImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px'
                }}
            >
                <p className="bg-black/50 text-white p-2 rounded">Humidity</p>
            </div>
      </div>
      
    </div>

  )
}

export default PlantHealth
