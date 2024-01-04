"use client"
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import Nav from '@/components/Layout/Nav';
import Header from "@/components/Layout/Header";
import { fetchPlaylists, fetchUser } from "../lib/helpers";

export default function Home({
  spotifyClientId,
  spotifyClientSecret
}: {
  spotifyClientId: string,
  spotifyClientSecret: string
}) {

  const { data: session } = useSession();
  const userEmail = session?.user?.email as string;

  const [isLoading, setIsLoading] = useState(true);

  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const vantaRef = useRef(null);

  const [userId, setUserId] = useState('');
  const [providerAccountId, setProviderAccountId] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [playlists, setPlaylists] = useState<any[]>([]); // TODO: type this as Playlist[]

  // FETCH USER AND PLAYLISTS
  useEffect(() => {
    if (session
      || !sessionStorage.getItem('userId')
      || !sessionStorage.getItem('providerAccountId')
      || !sessionStorage.getItem('refreshToken')
      || !sessionStorage.getItem('createMonthly')
      || !sessionStorage.getItem('playlists')) {
      fetchUser(userEmail).then(() => {
        setUserId(sessionStorage.getItem('userId') as string);
        setProviderAccountId(sessionStorage.getItem('providerAccountId') as string);
        setRefreshToken(sessionStorage.getItem('refreshToken') as string);
        fetchPlaylists(userId, setPlaylists);
      })
    }
  }, [session])

  // VANTA EFFECT
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

  // LOADING
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
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
        <Header />
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