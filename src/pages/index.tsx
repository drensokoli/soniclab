"use client"
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import Nav from '@/components/Layout/Nav';
import Header from "@/components/Layout/Header";
import { fetchPlaylists, fetchUser } from "../lib/helpers";
import Head from "next/head";

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
    if (sessionStorage.getItem('playlists') && sessionStorage.getItem('userId') && sessionStorage.getItem('providerAccountId') && sessionStorage.getItem('refreshToken')) {
      setPlaylists(JSON.parse(sessionStorage.getItem('playlists') as string));
      setUserId(sessionStorage.getItem('userId') as string);
      setProviderAccountId(sessionStorage.getItem('providerAccountId') as string);
      setRefreshToken(sessionStorage.getItem('refreshToken') as string);
    } else {
      fetchUser(userEmail, setPlaylists).then(() => {
        setUserId(sessionStorage.getItem('userId') as string);
        setProviderAccountId(sessionStorage.getItem('providerAccountId') as string);
        setRefreshToken(sessionStorage.getItem('refreshToken') as string);
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
    if (vantaRef) {
      setIsLoading(false);
    }
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
      <Head>
        <title>SonicLab</title>
        <meta name="description" content="Save popular and trending movies to your Notion list or search for your favourites. All your movies in one place, displayed in a beautiful Notion template." />
        <meta name="robots" content="all"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="Dren Sokoli" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://soniclab.vercel.app" />

        <meta property="og:title" content="SonicLab - Create Spotify playlists tailored to you." />
        <meta property="og:description" content="Create playlists with your top tracks, recent tracks or have SonicLab create them for you automatically every month." />
        <meta property="og:image" content="https://soniclab.vercel.app/og.png" />
        <meta property="og:url" content="https://soniclab.vercel.app/" />
        <meta property="og:site_name" content="SonicLab" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@SokoliDren" />
        <meta name="twitter:creator" content="@SokoliDren" />
        <meta name="twitter:title" content="SonicLab - Create Spotify playlists tailored to you." />
        <meta name="twitter:description" content="Create playlists with your top tracks, recent tracks or have SonicLab create them for you automatically every month." />
        <meta name="twitter:image" content="https://soniclab.vercel.app/og.png" />
        <meta name="twitter:domain" content="soniclab.vercel.app" />
        <meta name="twitter:url" content="https://soniclab.vercel.app/" />
      </Head>
      <div ref={vantaRef} className='fixed w-screen h-screen'></div>
      <div className='flex flex-col justify center items-center h-auto min-h-screen'>
        <Header />
        <Nav
          spotifyClientId={spotifyClientId}
          spotifyClientSecret={spotifyClientSecret}
          providerAccountId={providerAccountId}
          refreshToken={refreshToken}
          playlists={playlists}
          setPlaylists={setPlaylists}
        />
      </div>
      <div className="flex flex-col h-auto">
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