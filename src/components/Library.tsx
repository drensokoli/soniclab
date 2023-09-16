import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";

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

export default function Library() {
    return (
        <>
            <div className='flex flex-col justify-center items-center py-20 text-center gap-6'>
                <h1 className='text-2xl md:text-3xl text-gray-300'>You are not signed in.</h1>
                <p className='text-lg md:text-xl text-gray-300'>Please sign in to see your monthly and AI generated Spotify playlists from SpotiLab</p>
                <button
                    type="button"
                    className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                    data-te-ripple-init>
                    Sign In
                </button>
            </div>
            <div className='flex flex-col w-full hidden'>
                <div className='flex flex-row justify-center items-center pt-12 gap-6'>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/37i9dQZF1E35EHS4sKqRJq?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/37i9dQZF1E38Isr4yL497m?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/2HdTWOys41H1CZjTnhOz2k?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
                <div className='flex flex-row justify-center items-center pt-12 gap-6'>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/37i9dQZF1E38Isr4yL497m?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/2HdTWOys41H1CZjTnhOz2k?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                    <iframe className='opacity-75' src="https://open.spotify.com/embed/playlist/37i9dQZF1E35EHS4sKqRJq?utm_source=generator" width="30%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </div>
        </>
    )
}
