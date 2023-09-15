"use client"
import Image from 'next/image'
import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import Monthly from '../components/Monthly'
import AIGen from '../components/AIGen'
import Footer from '../components/Footer'
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import {
  signIn,
  signOut,
  useSession
} from 'next-auth/react';


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
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [vantaEffect])

  return (
    <>
      <div ref={vantaRef} className='flex flex-col h-fit'>
        {/* <div className='flex flex-col justify-center items-center h-1/4'>
          <button className='bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-full' onClick={() => signIn()}>Login</button>
        </div> */}
        <div className='flex flex-col justify-center items-center h-1/4 py-16'>
          <h1 className={`sm:text-7xl font-bold text-4xl text-gray-400 ${bebas_neue.className}`}>Spoti-Engine</h1>
        </div>
        <div className='flex flex-col justify center items-center'>
          <Tabs value="html" className="w-5/6">
            <TabsHeader>
              <Tab value="html" className={`${montserrat.className}`}>Monthly Playlists</Tab>
              <Tab value="react" className={`${montserrat.className}`}>AI Gen Playlists</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="html">
                <Monthly />
              </TabPanel>
              <TabPanel value="react">
                <AIGen />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
        <Footer />
      </div>
      {/* <div className='flex flex-col items-end justify-end h-full'>

      </div> */}
    </>
  )
}
