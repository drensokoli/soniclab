import { useSession } from 'next-auth/react'
import NotSignedIn from './NotSignedIn';
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Library() {
    const { data: session } = useSession();

    const [playlists, setPlaylists] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaylists = async () => {
            setIsLoading(true);
            if (session && sessionStorage.getItem('playlists')) {
                const playlistsString = sessionStorage.getItem('playlists');
                if (playlistsString !== null) {
                    setPlaylists(JSON.parse(playlistsString));
                }
            }
        };

        fetchPlaylists().then(() => setIsLoading(false));
    }, [session]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            if (session && sessionStorage.getItem('playlists')) {
                const playlistsString = sessionStorage.getItem('playlists');
                if (playlistsString !== null) {
                    setPlaylists(JSON.parse(playlistsString));
                }
            }
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [session]);

    if (isLoading) {
        return <Loading
            height='h-[400px]'
            bgColor='transparent' />;
    }

    return (
        <>
            {session ? (
                <>
                    {!(playlists.length === 0) ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
                            {playlists.map((playlistId, index) => (
                                <div key={index} className=" flex flex-col gap-2">
                                    <iframe className='opacity-75' src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                    {/* <h1 className='text-gray-200'>Description</h1> */}
                                    <button
                                        type="button"
                                        className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                                        data-te-ripple-init
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col h-[200px] justify-center items-center'>
                            <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>Your SpotiLab playlists will appear here</h1>
                            <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>Head over to the Playlist Generator tab and create your first playlist</h1>
                        </div>
                    )}
                </>
            ) : (
                <NotSignedIn title='Please sign in to see your monthly and AI generated Spotify playlists from SpotiLab' />
            )}
        </>
    )
}
