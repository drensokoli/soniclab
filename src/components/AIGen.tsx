import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { createPlaylist, searchSongs } from '../lib/spotify';
import { SiSpotify } from '@icons-pack/react-simple-icons';

export default function AIGen({ spotifyClientId, spotifyClientSecret }: { spotifyClientId: string, spotifyClientSecret: string }) {
    const { data: session } = useSession();

    const [providerAccountId, setProviderAccountId] = useState('');
    const [refreshToken, setRefreshToken] = useState('');

    const [description, setDescription] = useState('');
    const [range, setRange] = useState(25);
    const [songIds, setSongIds] = useState<string[]>([]);
    const [playlistNames, setPlaylistNames] = useState<string[]>([]);
    const [playlistName, setPlaylistName] = useState('');
    const [playlistId, setPlaylistId] = useState('');
    const [loading, setLoading] = useState(false);

    async function fetchUser() {
        try {
            const response = await fetch('/api/getUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userEmail: session?.user?.email,
                }),
            });
            const data = await response.json();

            setProviderAccountId(data.providerAccountId);
            setRefreshToken(data.refresh_token);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (session)
            fetchUser();
    }, [])

    const fetchSongIds = async () => {
        setLoading(true);
        try {

            const songNames = [
                'track:California%20Love%20artist:2Pac%20&type=track',
                'track:Gin%20and%20Juice%20artist:Snoop%20Dogg&type=track',
                'track:My%20Name%20Is%20artist:Eminem&type=track',
                'track:Mo%20Money%20Mo%20Problems%20artist:The%20Notorious%20B.I.G.%20feat.%20Puff%20Daddy%20and%20Mase&type=track',
                'track:Hypnotize%20artist:The%20Notorious%20B.I.G.&type=track',
            ];

            const playlistNames = [
                "90s Hip-Hop Throwback",
                "Vintage Vibe: Hip-Hop Edition",
                "Nostalgic Rap Jams",
                "Decades of Dope Beats",
                "Retro Rhythms: 90s Hip-Hop",
                "Timeless Hip-Hop Classics",
                "Old Skool Hip-Hop Chronicles",
                "Backspin: 90s Hip-Hop Gems",
            ];

            const ids = await searchSongs(songNames, refreshToken, spotifyClientId, spotifyClientSecret);

            setPlaylistNames(playlistNames);
            setSongIds(ids);
            setDescription('');

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 2000); // wait for 3 seconds before setting loading to false
        }
    };

    function removeSongId(songIdToRemove: string) {
        setSongIds((prevSongIds) => prevSongIds.filter((songId) => songId !== songIdToRemove));
    }

    return (
        <>
            {session ? (
                <>
                    {loading ? (
                        <div className='h-[400px] flex flex-col justify-center items-center gap-4'>
                            <div className="cssload-loader-inner">
                                <div className="cssload-cssload-loader-line-wrap-wrap">
                                    <div className="cssload-loader-line-wrap"></div>
                                </div>
                                <div className="cssload-cssload-loader-line-wrap-wrap">
                                    <div className="cssload-loader-line-wrap"></div>
                                </div>
                                <div className="cssload-cssload-loader-line-wrap-wrap">
                                    <div className="cssload-loader-line-wrap"></div>
                                </div>
                                <div className="cssload-cssload-loader-line-wrap-wrap">
                                    <div className="cssload-loader-line-wrap"></div>
                                </div>
                                <div className="cssload-cssload-loader-line-wrap-wrap">
                                    <div className="cssload-loader-line-wrap"></div>
                                </div>
                            </div>
                        </div>
                    ) : !(songIds.length > 0) ? (
                        <>
                            <div className='flex flex-col justify-center items-center' id='song-generator'>
                                <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>Write your playlist description here</h1>
                                <textarea id="description" rows={4} className="block p-2.5 w-full md:w-3/4 text-md text-gray-300 bg-transparent rounded-lg border border-gray-200" placeholder="The playlist should contain HipHop and R&B songs from the 90s..."
                                    onChange={(e) => setDescription(e.target.value)}
                                ></textarea>
                                <div className='flex justify-center items-center w-full md:w-3/4 pt-4'>
                                    <div className='flex flex-row items-center cursor-pointer text-gray-300 hover:text-gray-400 w-fit'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                        </svg>
                                        <h1 className='text-sm'>Get inspired</h1>
                                    </div>
                                </div>
                                <div className='w-full md:w-3/4 py-8'>
                                    <h1 className='text-center font-bold text-xl md:text-2xl text-gray-300'>Number of songs: <span className='border-b-2 border-gray-200'>{range}</span></h1>
                                    <input
                                        type="range"
                                        className="transparent h-[4px] w-full cursor-pointer accent-[#f33f81] border-transparent bg-neutral-200 dark:bg-neutral-600"
                                        id="customRange1"
                                        min={1}
                                        max={50}
                                        defaultValue={25}
                                        onChange={(e) => setRange(parseInt(e.target.value))}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={`inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black ${!description ? 'opacity-50' : ''}`}
                                    data-te-ripple-init
                                    onClick={() => fetchSongIds()}
                                    disabled={!description}
                                >
                                    Generate Songs
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-col justify-center items-center gap-4'>
                            <h1 className='text-xl py-4 md:text-2xl font-bold text-gray-300 text-center'>Pick a name for your playlist</h1>
                            <input
                                id="description"
                                className=" block p-2.5 w-full md:w-4/5 text-md text-gray-300 bg-transparent rounded-lg border border-gray-200"
                                placeholder="Playlist Name"
                                value={playlistName}
                                onChange={(e) => setPlaylistName(e.target.value)}
                            />
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
                                {playlistNames.map((playlistName, index) => (
                                    <button
                                        key={index}
                                        className='bg-[#cf387a] hover:bg-[#a92e64] text-gray-200 py-1 px-2 rounded'
                                        onClick={() => setPlaylistName(playlistName)}
                                    >
                                        {playlistName}
                                    </button>
                                ))}
                            </div>
                            <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>Your generated songs</h1>
                            <div className='flex flex-col justify-center items-center w-full md:w-3/4'>
                                {songIds.map((songId, index) => (
                                    <div key={index} className='flex flex-row items-center justify-center gap-2 w-full'>
                                        <iframe className="" src={`https://open.spotify.com/embed/track/${songId}?utm_source=generator`} width="100%" height="100" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                        <button type="button" className={`bg-[#cf387a] rounded-3xl p-2 inline-flex items-center justify-center text-white hover:bg-[#9c2a5b] mb-4 ${songIds.length <= 1 ? 'opacity-50 mb-4' : ''}`}
                                            onClick={() => removeSongId(songId)}
                                            disabled={songIds.length <= 1}
                                        >
                                            <span className="sr-only">Close menu</span>
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                className={`inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black ${!playlistName ? 'opacity-50' : ''}`}
                                data-te-ripple-init
                                onClick={() => {
                                    createPlaylist(providerAccountId, refreshToken, playlistName, songIds, spotifyClientId, spotifyClientSecret)
                                        .then((playlistId) => {
                                            setPlaylistId(playlistId);
                                            setSongIds([]);
                                            setPlaylistName('');
                                            setRange(25);
                                        });
                                }}
                                disabled={!playlistName}
                            >
                                Create Playlist
                            </button>
                        </div>
                    )
                    }
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
