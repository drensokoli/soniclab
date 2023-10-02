import Image from 'next/image';

export default function SpotifyBubble({ playlistId, playlistName }: { playlistId: string, playlistName: string }) {

    return (
        <a href={`https://open.spotify.com/playlist/${playlistId}`} target='_blank' className='flex flex-col justify-center items-center py-4'>
            <div className='flex flex-col gap-2  border-2 border-white px-12 py-4 rounded-xl'>
                <h1 className='text-gray-300'>{playlistName}</h1>
                <div className='flex flex-row gap-2 justify-center items-center'>
                    <Image src="./spotify.png" alt="Spotify Icon" width={20} height={20} />
                    <h1 className='text-gray-300'>Open in Spotify</h1>
                </div>
            </div>
        </a>
    );
}