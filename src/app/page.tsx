"use client"
import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Library from '../components/Library'
import AIGen from '../components/AIGen'
import Footer from '../components/Footer'
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '500',
  style: 'normal',
})

const bebas_neue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  style: 'normal',
})

export default function Home() {

  const [vantaEffect, setVantaEffect] = useState(null)
  const vantaRef = useRef(null)

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NET({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          points: 20.00,
          maxDistance: 23.00,
          spacing: 20.00
        })
      )
    }
    // return () => {
    //   if (vantaEffect) vantaEffect.destroy()
    // }
  }, [vantaEffect])

  return (
    <>
      <div ref={vantaRef} className='fixed w-screen h-screen'></div>
      
      <div className='flex flex-col justify center items-center h-auto min-h-screen'>
        <div className='flex justify-center items-center h-1/4 py-16 z-10'>
          <h1 className={`sm:text-7xl font-bold text-5xl text-gray-300 ${bebas_neue.className}`}>Spoti-Engine</h1>
        </div>
        <Tabs value="monthly" className="w-5/6">
          <TabsHeader>
            <Tab value="monthly" className={`${montserrat.className}`}>Library</Tab>
            <Tab value="aigen" className={`${montserrat.className}`}>AI Gen</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value="monthly">
              <Library />
            </TabPanel>
            <TabPanel value="aigen">
              <AIGen />
            </TabPanel>
          </TabsBody>
        </Tabs>
        <div className='flex flex-grow'></div>
        <Footer />
      </div>
    </>
  )
}
