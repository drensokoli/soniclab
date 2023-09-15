"use client"

import Image from 'next/image'
import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: '600',
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
      <div ref={vantaRef} className='h-screen'>
        <div className='flex flex-col justify-center items-center h-1/4'>
          <h1 className={`sm:text-7xl font-bold text-4xl text-gray-400 ${bebas_neue.className}`}>Spoti-Engine</h1>
        </div>
        <div className='flex flex-col justify center items-center'>

          <Tabs value="html" className="w-5/6">
            <TabsHeader>
              <Tab value="html">Monthly Playlists</Tab>
              <Tab value="react">AI Gen Playlists</Tab>
            </TabsHeader>
            <TabsBody>
              <TabPanel value="html">
                <div className='flex flex-col gap-4 justify-center items-center'>
                  <div className='flex flex-row gap-4 justify-center items-center'>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                  </div>
                  <div className='flex flex-row gap-4 justify-center items-center'>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                  </div>
                </div>
              </TabPanel>
              <TabPanel value="react">
                <div className='flex flex-col justify-center items-center'>
                  <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-400 text-center'>Write your playlist description here</h1>
                  <textarea id="description" rows="4" class="block p-2.5 w-full md:w-3/4 text-md text-gray-400 bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="The playlist should cotnain HipHop and R&B songs from the 90s..."></textarea>
                  <div className='flex flex-row justify-end cursor-pointer text-gray-400 w-full md:w-3/4 py-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    <h1>Get inspired</h1>
                  </div>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" async></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" async></script>
    </>
  )
}
