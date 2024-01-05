import { handleDeletePlaylist } from '@/lib/helpers';

interface Playlist {
    playlistId: string;
    playlistName: string;
    description: string;
    created_at: string;
    type: string;
}

export default function Library(
    {
        playlists,
        setPlaylists,
        spotifyClientId,
        spotifyClientSecret,
    }: {
        playlists: Playlist[];
        setPlaylists: any;
        spotifyClientId: string;
        spotifyClientSecret: string;
    }
) {
    const refreshToken = sessionStorage.getItem('refreshToken')?.toString() || '';

    return (
        <>
            <div className='flex flex-row justify-center items-center'>
                <div className='w-[95%] pt-8'>
                    {playlists.length !== 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                            {playlists.map((playlist, index) => (
                                <div key={index} className='flex flex-col gap-2 p-3 z-10 border-2 border-[#f33f81] border-opacity-40 backdrop-blur rounded-md '>
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
                                        className='inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black z-10'
                                        data-te-ripple-init
                                        onClick={() => handleDeletePlaylist(playlist.playlistId, playlist.type, setPlaylists, refreshToken, spotifyClientId, spotifyClientSecret)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col h-[200px] justify-center items-center'>
                            <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>
                                Your SonicLab playlists will appear here
                            </h1>
                            <h1 className='text-xl md:text-xl font-bold text-gray-400 opacity-70 text-center'>
                                Head over to the Playlist Generator tab and create your first playlist
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}