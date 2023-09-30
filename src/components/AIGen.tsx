import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { createPlaylist, searchSongs } from '../lib/spotify';
import { SiSpotify } from '@icons-pack/react-simple-icons';
import Loading from './Loading';
import AIGenForm from './AIGenForm';
import PlaylistCreator from './PlaylistCreator';
import NotSignedIn from './NotSignedIn';

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
            }, 2000);
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
                        <Loading height='h-[400px]' bgColor='' />
                    ) : !(songIds.length > 0) ? (
                        <>
                            <AIGenForm setDescription={setDescription} setRange={setRange} fetchSongIds={fetchSongIds} description={description} range={range} />
                            {!playlistId &&
                                <a href={`https://open.spotify.com/playlist/${playlistId}?si=4e338eb7220f49de`} className='flex flex-col justify-center items-center py-4'>
                                    <div className='flex flex-col gap-2 justify-center items-center border-2 border-white px-12 py-4 rounded-xl'>
                                        <h1 className='text-gray-300'>Playlist created!</h1>
                                        <div className='flex flex-row gap-2'>
                                        <SiSpotify className='text-gray-300' />
                                        <h1 className='text-gray-300'>{playlistName}</h1>
                                        </div>
                                    </div>
                                </a>
                            }
                        </>
                    ) : (
                        <PlaylistCreator setPlaylistName={setPlaylistName} playlistNames={playlistNames} songIds={songIds} setSongIds={setSongIds} removeSongId={removeSongId} playlistName={playlistName} createPlaylist={createPlaylist} providerAccountId={providerAccountId} refreshToken={refreshToken} spotifyClientId={spotifyClientId} spotifyClientSecret={spotifyClientSecret} setPlaylistId={setPlaylistId} setRange={setRange} />
                    )
                    }
                </>
            ) : (
                <NotSignedIn title='Please sign in to generate your AI Spotify playlist with SpotiLab' />
            )}
        </>
    )
}
