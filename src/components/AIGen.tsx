import { signIn, signOut, useSession } from 'next-auth/react';
import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import { createPlaylist } from '../lib/spotify';

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '600',
    style: 'normal',
})

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})


export default function AIGen() {
    const { data: session, status } = useSession();
    const user = session?.user?.name;

    const [userId, setUserId] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const fetchUser = async () => {
        const res = await fetch('/api/getUser');
        const data = await res.json();
        console.log("data: ", data);

        setUserId(data.providerAccountId);
        setAccessToken(data.access_token);
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const songIds = [
        '4VMOFyIl8weDI5BXyti7sn',
        '4neUUFnrFl1YrdtdZOAwBV',
    ];
    
    return (
        <>
            {session ? (
                <>
                    <div className='flex flex-col justify-center items-center'>
                        <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>Write your playlist description here</h1>
                        <textarea id="description" rows={4} className="block p-2.5 w-full md:w-3/4 text-md text-gray-300 bg-transparent rounded-lg border border-gray-200" placeholder="The playlist should contain HipHop and R&B songs from the 90s..."></textarea>
                        <div className='flex justify-center items-center w-full md:w-3/4 py-4'>
                            <div className='flex flex-row items-center cursor-pointer text-gray-300 hover:text-gray-400 w-fit'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                <h1 className='text-sm'>Get inspired</h1>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                            data-te-ripple-init
                            onClick={() => createPlaylist(userId, accessToken, 'SpotiLab-01', songIds)}
                        >
                            Generate Songs
                        </button>
                    </div>
                </>
            ) : (
                <div className='flex flex-col justify-center items-center py-20 text-center gap-6'>
                    <h1 className='text-2xl md:text-3xl text-gray-300'>You are not signed in.</h1>
                    <p className='text-lg md:text-xl text-gray-300'>Please sign in to generate your AI Spotify playlist with SpotiLab</p>
                    <button
                        type="button"
                        className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                        data-te-ripple-init
                        onClick={() => signIn('spotify')}
                    >
                        Sign In
                    </button>
                </div>
            )}
        </>
    )
}
