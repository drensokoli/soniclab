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
  const [isLoading, setIsLoading] = useState(true);
  const [vantaEffect, setVantaEffect] = useState<any>(null); // Explicitly define the type as 'any'
  const vantaRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !vantaEffect && vantaRef.current) {
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
  }, [isLoading, vantaEffect])

  useEffect(() => {
    // Simulate an asynchronous operation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Change the duration as per your requirement
  }, [])

  return (
    <>
      {isLoading ? (
        <div className='h-screen bg-[#23153c] flex flex-col justify-center items-center gap-4'>
          <h1 className={`${montserrat.className} text-lg text-white`}>Getting things ready!</h1>
          <div role="status">
            <svg aria-hidden="true" className="inline w-12 h-12 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-[#f33f81]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
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
      )}
    </>
  )
}
