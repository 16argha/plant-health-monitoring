import React from 'react'
import Marquee from './Components/Marquee'
import Hero from './Components/Hero'
import Navbar from './Components/Navbar'
import PlantHealth from './Components/PlantHealth'
import Disease from './Components/Disease'

function App() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Marquee/>
      <PlantHealth/>
      <Disease/>
    </div>
  )
}

export default App
