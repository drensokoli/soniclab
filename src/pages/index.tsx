"use client"
import { Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import Nav from '@/components/Layout/Nav';

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

  const [userId, setUserId] = useState('');
  const [providerAccountId, setProviderAccountId] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const user = session?.user?.name;

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

      setUserId(data.userId);
      setProviderAccountId(data.providerAccountId);
      setRefreshToken(data.refresh_token);

      sessionStorage.setItem('userId', data.userId);
      sessionStorage.setItem('providerAccountId', data.providerAccountId);
      sessionStorage.setItem('refreshToken', data.refresh_token);
      sessionStorage.setItem('createMonthly', data.createMonthly);

    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (session && !sessionStorage.getItem('userId') && !sessionStorage.getItem('providerAccountId') && !sessionStorage.getItem('refreshToken') && !sessionStorage.getItem('createMonthly')) {
      fetchUser();
    } else if (session && sessionStorage.getItem('userId') && sessionStorage.getItem('providerAccountId') && sessionStorage.getItem('refreshToken') && sessionStorage.getItem('createMonthly')) {
      setUserId(sessionStorage.getItem('userId') as string);
      setProviderAccountId(sessionStorage.getItem('providerAccountId') as string);
      setRefreshToken(sessionStorage.getItem('refreshToken') as string);
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
    }, 1000);
  }, [])


  if (isLoading) {
    return (
      <Loading
        height='h-screen'
        bgColor='bg-[#23153c]'
      />
    )
  }

  return (
    <>
      <div ref={vantaRef} className='fixed w-screen h-screen'></div>
      <div className='flex flex-col justify center items-center h-auto min-h-screen'>
        <div className='flex flex-col justify-center items-center h-1/4 pb-10 pt-16 z-10 gap-4'>
          <h1 className={`sm:text-8xl font-bold text-7xl text-[#f33f81] opacity-70 ${bebas_neue.className}`}>SpotiLab</h1>

          {session && (
            <a href='/profile' className='flex flex-row justify-center items-center gap-2'>
              <img
                src={session?.user?.image?.toString()!}
                alt="Profile image"
                className="rounded-full mx-auto w-12 h-12 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 "
                width={20}
                height={20}
              />
              <h1 className='text-gray-300 text-lg text-bold z-10'>{user}</h1>
            </a>
          )}

        </div>
        <Nav
          spotifyClientId={spotifyClientId}
          spotifyClientSecret={spotifyClientSecret}
          providerAccountId={providerAccountId}
          refreshToken={refreshToken}
        />
        <Footer />
      </div>
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