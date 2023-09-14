"use client"

import Image from 'next/image'
import { Montserrat } from 'next/font/google'
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
  const data = [
    {
      label: "Monthly Playlists",
      value: "html",
    },
    {
      label: "AI Gen Playlists",
      value: "react",
    }
  ];
  return (
    <>
      <div ref={vantaRef} className='h-screen'>
        <div className='flex flex-col justify-center items-center h-1/4'>
          <h1 className={`sm:text-6xl font-bold text-4xl text-white ${montserrat.className}`}>SpotiEngine</h1>
        </div>
        <div className='flex flex-col justify center items-center'>

          <Tabs value="html" className="w-5/6">
            <TabsHeader>
              {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  {label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" async></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" async></script>
    </>
  )
}
