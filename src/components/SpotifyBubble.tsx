import { SiSpotify } from '@icons-pack/react-simple-icons';

export default function SpotifyBubble({ playlistId }: { playlistId: string }) {

    return (
        <div className='flex flex-col justify-center items-center py-4'>
            <a href={`https://open.spotify.com/playlist/${playlistId}`} target='_blank'>
                <div className='flex flex-col gap-2 justify-center items-center border-2 border-white px-12 py-4 rounded-xl'>
                    <SiSpotify className='text-gray-300' />
                    <h1 className='text-gray-300'>Open in Spotify</h1>
                </div>
            </a>
        </div>
    );
}