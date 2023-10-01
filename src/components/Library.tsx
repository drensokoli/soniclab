import { useSession } from 'next-auth/react'
import NotSignedIn from './NotSignedIn';
import { useEffect, useState } from 'react';

export default function Library() {
    const { data: session, status } = useSession();

    const [playlists, setPlaylists] = useState<string[]>([]);
    // const playlists = [
    //     '1LdfTs1ksJzE7k0pN09FKr',
    //     '37i9dQZF1E8Ep6B1tFwURi',
    //     '37i9dQZF1DWSPMbB1kcXmo',
    //     '0LbRnQanwBZvokjkYaV1bR',
    //     '07r0pMwLekrqdt5fKQHsKV',
    //     '37i9dQZF1E4kMz3pHspFDx',
    // ];

    async function fetchPlaylists() {
        const userId = sessionStorage.getItem('userId');

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
            const monthlyPlaylists = data.monthly_playlists.map((playlist: { playlistId: any; }) => playlist.playlistId);
            const aiGenPlaylists = data.ai_gen_playlists.map((playlist: { playlistId: any; }) => playlist.playlistId);
            const allPlaylists = [...monthlyPlaylists, ...aiGenPlaylists];

            setPlaylists(allPlaylists);
            sessionStorage.setItem('playlists', JSON.stringify(allPlaylists));

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (session && !sessionStorage.getItem('playlists')) {
            fetchPlaylists();
        } else if (session && sessionStorage.getItem('playlists')) {
            setPlaylists(JSON.parse(sessionStorage.getItem('playlists') as string));
        }
    }, [session])

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
