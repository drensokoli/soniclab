"use client"
import { useEffect, useRef, useState } from "react";
import NET from "vanta/dist/vanta.net.min";
import Footer from '../components/Layout/Footer'
import { getSession, useSession } from 'next-auth/react';
import Loading from '@/components/Helpers/Loading';
import Header from '@/components/Layout/Header';
import BackButton from '@/components/Helpers/BackButton';
import SignOutButton from '@/components/Helpers/SignOutButton';
import ProfileSettings from '@/components/Helpers/ProfileSettings';
import { fetchUser } from '@/lib/helpers';
import HeaderCopy from "@/components/Layout/Header";

export default function Profile() {

    const { data: session } = useSession();
    const userEmail = session?.user?.email as string;

    const [isLoading, setIsLoading] = useState(true);

    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef(null);

    // FETCH USER SETTINGS
    useEffect(() => {
        if (session
            || !sessionStorage.getItem('createMonthly')
            || !sessionStorage.getItem('createHalfYear')) {
            fetchUser(userEmail, undefined)
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
            <div ref={vantaRef} className='fixed w-screen h-screen'></div>
            <div className='flex flex-col min-h-screen'>
                <Header />
                <ProfileSettings />
            </div>
            <div className="flex flex-col h-auto">
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