import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Library from '../components/Library'
import AIGen from '../components/AIGen'
import Footer from '../components/Footer'
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import { useSession } from 'next-auth/react';
import Image from 'next/image'

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
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);
  const { data: session, status } = useSession();
  const user = session?.user?.name;
  const userImage = session?.user?.image;

  useEffect(() => {
    if (!isLoading && !vantaEffect && vantaRef.current) {
      const spacing = window.innerWidth >= 640 ? 20 : 30;
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
          spacing: spacing
        })
      )
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [isLoading, vantaEffect])

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [])

  return (
    <>
      {isLoading ? (
        <div className='h-screen bg-[#23153c] flex flex-col justify-center items-center gap-4'>
          <div className="cssload-loader-inner">
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
            <div className="cssload-cssload-loader-line-wrap-wrap">
              <div className="cssload-loader-line-wrap"></div>
            </div>
          </div>
        </div>
      ) : (
        <>

          <div ref={vantaRef} className='fixed w-screen h-screen'></div>
          <div className='flex flex-col justify center items-center h-auto min-h-screen'>
            <div className='flex flex-col justify-center items-center h-1/4 py-16 z-10 gap-4'>
              <h1 className={`sm:text-8xl font-bold text-7xl text-[#f33f81] opacity-70 ${bebas_neue.className}`}>SpotiLab</h1>
              {session ?
                (

                  <div className='flex flex-row justify-center items-center gap-2'>
                    <Image src={session?.user?.image?.toString()!} alt="Profile image" className="rounded-full mx-auto w-12 h-12 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 " width={20} height={20} />
                    <h1 className='text-gray-300 text-lg text-bold z-10 '>{user}</h1>
                  </div>
                ) : (
                  <>
                  </>
                )
              }
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
