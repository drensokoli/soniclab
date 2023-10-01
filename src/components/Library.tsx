import { useSession } from 'next-auth/react'
import NotSignedIn from './NotSignedIn';
import { useEffect, useState } from 'react';
import Loading from './Loading';

export default function Library() {
    const { data: session } = useSession();

    const [playlists, setPlaylists] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (session && sessionStorage.getItem('playlists')) {
                const playlistsString = sessionStorage.getItem('playlists');
                if (playlistsString !== null) {
                    setPlaylists(JSON.parse(playlistsString));
                }
            }
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [session]);

    useEffect(() => {
        if (session && sessionStorage.getItem('playlists')) {
            const playlistsString = sessionStorage.getItem('playlists');
            if (playlistsString !== null) {
                setPlaylists(JSON.parse(playlistsString));
                setIsLoading(false);
            }
        }
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                            {playlists.map((playlistId, index) => (
                                <div key={index} className="">
                                    <iframe className='opacity-75' src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`} width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col justify-center items-center' id='song-generator'>
                            <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-300 text-center'>You have no playlists to show</h1>
                        </div>
                    )}
                </>
            ) : (
                <NotSignedIn title='Please sign in to see your monthly and AI generated Spotify playlists from SpotiLab' />
            )}
        </>
    )
}
