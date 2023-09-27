import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { createPlaylist } from '../lib/spotify';


export default function AIGen({ spotifyClientId, spotifyClientSecret }: { spotifyClientId: string, spotifyClientSecret: string }) {
    const { data: session, status } = useSession();

    const [userId, setUserId] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [songIds, setSongIds] = useState<string[]>([]);
    const [playlistNames, setPlaylistNames] = useState<string[]>([]);
    const [playlistName, setPlaylistName] = useState('');

    const fetchUser = async () => {
        const res = await fetch('/api/getUser');
        const data = await res.json();
        console.log("data: ", data);

        setUserId(data.providerAccountId);
        setRefreshToken(data.refresh_token);
    }

    const generateSongs = async () => {

        const songNames = [
            'track:Gin%20and%20Juice%20artist:Snoop%20Dogg&type=track',
            'track:California%20Love%20artist:2Pac%20feat.%20Dr.%20Dre&type=track',
            'track:My%20Name%20Is%20artist:Eminem&type=track',
            'track:Mo%20Money%20Mo%20Problems%20artist:The%20Notorious%20B.I.G.%20feat.%20Puff%20Daddy%20and%20Mase&type=track',
            'track:Hypnotize%20artist:The%20Notorious%20B.I.G.&type=track',
        ];

        const songIds = [
            '4VMOFyIl8weDI5BXyti7sn',
            '4neUUFnrFl1YrdtdZOAwBV',
        ];

        const playlistNames = [
            'SpotiLab One',
            'SpotiLab Two',
            'SpotiLab Three',
            'SpotiLab Four',
            'SpotiLab Five',
            'SpotiLab Six',
        ];

        setSongIds(songIds);
        setPlaylistNames(playlistNames);
    }

    useEffect(() => {
        fetchUser();
    }, [])


    return (
        <>
            {session ? (
                <>
                    {!(songIds.length > 0) ? (
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
                                onClick={() => generateSongs()}
                            >
                                Generate Songs
                            </button>
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center'>
                            <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>Pick a name for your playlist</h1>
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                                {playlistNames.map((playlistName, index) => (
                                    <button
                                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded'
                                        onClick={() => setPlaylistName(playlistName)}
                                    >
                                        {playlistName}
                                    </button>
                                ))}
                            </div>
                            <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>Your generated songs</h1>
                            <div className='flex flex-col justify-center items-center w-full md:w-3/4'>
                                {songIds.map((songId, index) => (
                                    <iframe key={index} className="" src={`https://open.spotify.com/embed/track/${songId}?utm_source=generator`} width="100%" height="100" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                ))}
                            </div>
                            <button
                                type="button"
                                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                                data-te-ripple-init
                                onClick={() => createPlaylist(userId, refreshToken, playlistName, songIds, spotifyClientId, spotifyClientSecret)}
                            >
                                Create Playlist
                            </button>
                        </div>
                    )}
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
            )
            }
        </>
    )
}
