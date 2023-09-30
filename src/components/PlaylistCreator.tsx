import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, PromiseLikeOfReactNode, Key } from "react";

export default function PlaylistCreator({ setPlaylistName, playlistNames, songIds, setSongIds, removeSongId, playlistName, createPlaylist, providerAccountId, refreshToken, spotifyClientId, spotifyClientSecret, setPlaylistId, setRange }: any) {
    return (
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
                {playlistNames.map((playlistName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined, index: Key | null | undefined) => (
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
                {songIds.map((songId: any, index: Key | null | undefined) => (
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
                    console.log(`Playlist Name: ${playlistName}`);
                    createPlaylist(providerAccountId, refreshToken, playlistName, songIds, spotifyClientId, spotifyClientSecret)
                        .then((playlistId: any) => {
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
    );
};