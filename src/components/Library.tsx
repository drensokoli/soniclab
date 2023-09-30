import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";
import { signIn, useSession } from 'next-auth/react'
import NotSignedIn from './NotSignedIn';

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
    const { data: session, status } = useSession();

    const playlists = [
        '1LdfTs1ksJzE7k0pN09FKr',
        '37i9dQZF1E8Ep6B1tFwURi',
        '37i9dQZF1DWSPMbB1kcXmo',
        '0LbRnQanwBZvokjkYaV1bR',
        '07r0pMwLekrqdt5fKQHsKV',
        '37i9dQZF1E4kMz3pHspFDx',
    ];

    return (
        <>
            {session ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                    {playlists.map((playlistId) => (
                        <div key={playlistId} className="">
                            <iframe className='opacity-75' src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                        </div>
                    ))}
                </div>
            ) : (
                <NotSignedIn title='Please sign in to see your monthly and AI generated Spotify playlists from SpotiLab' />
            )}
        </>
    )
}
