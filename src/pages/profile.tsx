"use client"
import { Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { getSession, useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import Library from '@/components/Profile/Library';

interface Playlist {
    playlistId: string;
    description: string;
    type: string;
}

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function Profile({
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

    const [refreshToken, setRefreshToken] = useState('');
    const [userId, setUserId] = useState('');

    async function fetchPlaylists(): Promise<Playlist[]> {
        try {
            const response = await fetch('/api/getPlaylists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                }),
            });

            const data = await response.json();

            const monthlyPlaylists = data.monthly_playlists.map((playlist: Playlist) => ({
                playlistId: playlist.playlistId,
                description: playlist.description,
                type: 'monthly_playlists',
            }));

            const aiGenPlaylists = data.ai_gen_playlists.map((playlist: Playlist) => ({
                playlistId: playlist.playlistId,
                description: playlist.description,
                type: 'ai_gen_playlists',
            }));

            const allPlaylists = [...monthlyPlaylists, ...aiGenPlaylists];

            sessionStorage.setItem('playlists', JSON.stringify(allPlaylists));

            return allPlaylists;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

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
        setRefreshToken(sessionStorage.getItem('refreshToken') as string);
        setUserId(sessionStorage.getItem('userId') as string);
        fetchPlaylists();
    }, [fetchPlaylists])

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
                    <ProfileSettings />
                    <Library spotifyClientId={spotifyClientId} spotifyClientSecret={spotifyClientSecret} refreshToken={refreshToken} />
                </div>
                <div className='flex flex-grow'></div>
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