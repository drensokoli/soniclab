import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Loading from '../Helpers/Loading';
import { deletePlaylist } from '@/lib/spotify';
import axios from 'axios';

interface Playlist {
    playlistId: string;
    playlistName: string;
    description: string;
    type: string;
}

export default function Library(
    {
        spotifyClientId,
        spotifyClientSecret,
    }: {
        spotifyClientId: string;
        spotifyClientSecret: string;
    }
) {
    const { data: session } = useSession();

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const refreshToken = sessionStorage.getItem('refreshToken')?.toString() || '';

    const handleDeletePlaylist = async (playlistId: string, playlistType: string) => {
        try {

            deletePlaylist(refreshToken, spotifyClientId, spotifyClientSecret, playlistId);

            const userId = sessionStorage.getItem('userId');
            const response = await axios.delete('/api/deletePlaylist', {
                data: {
                    userId: userId,
                    playlistId: playlistId,
                    playlistType: playlistType,
                },
            });

            if (response.status === 200) {
                const playlistsString = sessionStorage.getItem('playlists');

                if (playlistsString !== null) {

                    const playlists = JSON.parse(playlistsString);
                    const updatedPlaylists = playlists.filter((playlist: Playlist) => playlist.playlistId !== playlistId);
                    sessionStorage.setItem('playlists', JSON.stringify(updatedPlaylists));
                    const newPlaylistsString = sessionStorage.getItem('playlists');

                    if (newPlaylistsString !== null) {
                        setPlaylists(JSON.parse(newPlaylistsString));
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsLoading(true);
        if (session) {
            const playlistsString = sessionStorage.getItem('playlists');
            if (playlistsString !== null) {
                setPlaylists(JSON.parse(playlistsString));
            }
        }
        setIsLoading(false);
    }, [session]);


    if (isLoading) {
        return <Loading height='h-[400px]' bgColor='transparent' />;
    }

    return (
        <>
            <div className='w-[75%] md:w-[85%] pt-4'>
                {!(playlists.length === 0) ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
                        {playlists.map((playlist, index) => (
                            <div key={index} className='flex flex-col gap-2'>
                                <iframe
                                    className='opacity-75'
                                    src={`https://open.spotify.com/embed/playlist/${playlist.playlistId}?utm_source=generator`}
                                    width='100%'
                                    height='420'
                                    allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
                                    loading='lazy'
                                ></iframe>
                                <button
                                    type='button'
                                    className='inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black'
                                    data-te-ripple-init
                                    onClick={() => handleDeletePlaylist(playlist.playlistId, playlist.type)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col h-[200px] justify-center items-center'>
                        <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>
                            Your SpotiLab playlists will appear here
                        </h1>
                        <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>
                            Head over to the Playlist Generator tab and create your first playlist
                        </h1>
                    </div>
                )}
            </div>
        </>
    );
}