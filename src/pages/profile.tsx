"use client"
import { Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { getSession, useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import ProfileSettings from '@/components/Profile/ProfileSettings';
import Library from '@/components/Profile/Library';
import Link from 'next/link';

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function Profile({
    spotifyClientId,
    spotifyClientSecret,
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
}) {

    const [isLoading, setIsLoading] = useState(true);

    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef(null);

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
            <div className='flex flex-col justify center items-center'>
                <div className='flex flex-col justify-center items-center h-1/4 pb-10 pt-16 z-10 gap-4 w-full'>
                    <Link href='/' className='absolute md:top-7 top-3 md:left-9 left-4'>
                        <button type="button" className=" text-white rounded-md border-gray-100 py-2 hover:text-white">
                            <div className="flex flex-row align-middle">
                                <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                                </svg>
                                <p className={`${bebas_neue.className} text-2xl`}>HOME</p>
                            </div>
                        </button>
                    </Link>
                    <h1 className={`sm:text-8xl font-bold text-7xl text-[#f33f81] opacity-70 ${bebas_neue.className}`}>SpotiLab</h1>
                    <ProfileSettings />
                    <Library spotifyClientId={spotifyClientId} spotifyClientSecret={spotifyClientSecret} />
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