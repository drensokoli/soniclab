"use client"

import Image from 'next/image'
import { Montserrat } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

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

  return (
    <>
      <div ref={vantaRef} className='h-screen'>
        <div className='flex flex-col justify-center items-center h-1/3'>
          <h1 className={`sm:text-6xl font-bold text-4xl ${montserrat.className}`}>SpotiEngine</h1>
        </div>
      </div>

      <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js" async></script>
      <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js" async></script>
    </>
  )
}
