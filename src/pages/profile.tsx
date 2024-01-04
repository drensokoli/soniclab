"use client"
import { Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { getSession, useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import Library from '@/components/Layout/Library';
import Link from 'next/link';
import { fetchPlaylists, fetchUser } from '@/lib/helpers';
import Header from '@/components/Layout/Header';
import MonthlyToggle from '@/components/Helpers/MonthlyToggle';
import BackButton from '@/components/Helpers/BackButton';
import SignOutButton from '@/components/Helpers/SignOutButton';

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

interface Playlist {
    playlistId: string;
    playlistName: string;
    description: string;
    created_at: string;
    type: string;
}

export default function Profile({
    spotifyClientId,
    spotifyClientSecret,
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
}) {

    const { data: session } = useSession();
    const userEmail = session?.user?.email as string;

    const [isLoading, setIsLoading] = useState(true);

    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef(null);

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    // FETCH USER AND PLAYLISTS
    useEffect(() => {
        if (sessionStorage.getItem('playlists')) {
            setPlaylists(JSON.parse(sessionStorage.getItem('playlists') as string));
        }

        if (session) {
            fetchUser(userEmail)
                .then(() => {
                    fetchPlaylists(sessionStorage.getItem('userId') as string, setPlaylists as any)
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
            <div>
                <Header />
                <MonthlyToggle />
                <BackButton />
                <SignOutButton />
                <Library playlists={playlists} setPlaylists={setPlaylists} spotifyClientId={spotifyClientId} spotifyClientSecret={spotifyClientSecret} />
                <Footer />
            </div>

        </>
    )
}

export const getServerSideProps = async (context: any) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/',
            },
        };
    }

    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    return {
        props: {
            spotifyClientId,
            spotifyClientSecret
        }
    }
}