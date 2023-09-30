"use client"
import { Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Footer'
import { useSession } from 'next-auth/react';
import Loading from '@/components/Loading';
import Profile from '@/components/Profile';
import Nav from '@/components/Nav';

const bebas_neue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  style: 'normal',
})

export default function Home({
  spotifyClientId,
  spotifyClientSecret
}: {
  spotifyClientId: string,
  spotifyClientSecret: string
}) {
  
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(true);

  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  const [providerAccountId, setProviderAccountId] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  async function fetchUser() {
    try {
      const response = await fetch('/api/getUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session?.user?.email,
        }),
      });
      const data = await response.json();

      setProviderAccountId(data.providerAccountId);
      setRefreshToken(data.refresh_token);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (session) {
      fetchUser();
    }
  }, [session])

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
    }, 1500);
  }, [])

  return (
    <>
      {isLoading ? (
        <Loading
          height='h-screen'
          bgColor='bg-[#23153c]'
        />
      ) : (
        <>
          <div ref={vantaRef} className='fixed w-screen h-screen'></div>
          <div className='flex flex-col justify center items-center h-auto min-h-screen'>
            <div className='flex flex-col justify-center items-center h-1/4 pb-10 pt-16 z-10 gap-4'>
              <h1 className={`sm:text-8xl font-bold text-7xl text-[#f33f81] opacity-70 ${bebas_neue.className}`}>SpotiLab</h1>
              {session && (
                <Profile />
              )}
            </div>
            <Nav
              spotifyClientId={spotifyClientId}
              spotifyClientSecret={spotifyClientSecret}
              providerAccountId={providerAccountId}
              refreshToken={refreshToken}
            />
            <div className='flex flex-grow'></div>
            <Footer />
          </div>
        </>
      )}
    </>
  )
}

export const getServerSideProps = async () => {
  const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
  const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  return {
    props: {
      spotifyClientId,
      spotifyClientSecret
    }
  }
}