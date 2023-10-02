import { useSession } from 'next-auth/react';
import { use, useEffect, useState } from "react";
import { createPlaylist, searchSongs } from '../lib/spotify';
import { SiSpotify } from '@icons-pack/react-simple-icons';
import Loading from './Loading';
import AIGenForm from './AIGenForm';
import PlaylistCreator from './PlaylistCreator';
import NotSignedIn from './NotSignedIn';
import { type } from 'os';

export default function AIGen({
    spotifyClientId,
    spotifyClientSecret,
    providerAccountId,
    refreshToken
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    providerAccountId: string,
    refreshToken: string
}) {
    const { data: session } = useSession();

    const [description, setDescription] = useState('');
    const [range, setRange] = useState(25);
    const [songIds, setSongIds] = useState<string[]>([]);
    const [playlistNames, setPlaylistNames] = useState<string[]>([]);
    const [playlistName, setPlaylistName] = useState('');
    const [loading, setLoading] = useState(false);
    const [playlistId, setPlaylistId] = useState('');

    const type = "ai_gen";
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

            sessionStorage.setItem('playlistNames', JSON.stringify(playlistNames));
            sessionStorage.setItem('songIds', JSON.stringify(ids));
            sessionStorage.setItem('description', description);

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    const createPlaylistHandler = async () => {
        setLoading(true);

        try {
            const userId = sessionStorage.getItem('userId') as string;
            const description = sessionStorage.getItem('description') as string;

            // Add await here to wait for the playlistId
            const playlistId = await createPlaylist(
                providerAccountId,
                refreshToken,
                spotifyClientId,
                spotifyClientSecret,
                playlistName,
                songIds,
                type,
                userId,
                description,
                range
            );

            setPlaylistId(playlistId);

            sessionStorage.removeItem('songIds');
            sessionStorage.removeItem('playlistNames');
            sessionStorage.removeItem('description');

            setSongIds([]);
            setRange(25);
            setPlaylistName('');

            // Retrieve the existing playlist IDs
            const playlists = JSON.parse(sessionStorage.getItem('playlists') || '[]') as string[];

            // Append the new playlist ID
            playlists.push(playlistId);

            // Store the updated playlist IDs
            sessionStorage.setItem('playlists', JSON.stringify(playlists));

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    function removeSongId(songIdToRemove: string) {
        setSongIds((prevSongIds) => prevSongIds.filter((songId) => songId !== songIdToRemove));
        // remove songId from session storage
        sessionStorage.setItem('songIds', JSON.stringify(songIds.filter((songId) => songId !== songIdToRemove)));
    }

    useEffect(() => {
        if (sessionStorage.getItem('playlistNames') && sessionStorage.getItem('songIds') && sessionStorage.getItem('description')) {
            setPlaylistNames(JSON.parse(sessionStorage.getItem('playlistNames') as string));
            setSongIds(JSON.parse(sessionStorage.getItem('songIds') as string));
            setDescription(sessionStorage.getItem('description') as string);
        }
    }, []);

    return (
        <>
            {session ? (
                <>
                    {loading ? (
                        <Loading
                            height='h-[400px]'
                            bgColor='transparent'
                        />
                    ) : !(songIds.length > 0) ? (
                        <>
                            {playlistId && (
                            <div>
                                {playlistId}
                            </div>
                            )}
                            <AIGenForm
                                setDescription={setDescription}
                                setRange={setRange}
                                fetchSongIds={fetchSongIds}
                                description={description}
                                range={range}
                            />
                        </>
                    ) : (
                        <PlaylistCreator
                            setPlaylistName={setPlaylistName}
                            playlistNames={playlistNames}
                            songIds={songIds}
                            removeSongId={removeSongId}
                            playlistName={playlistName}
                            createPlaylistHandler={createPlaylistHandler}
                        />
                    )}
                </>
            ) : (
                <NotSignedIn title='Please sign in to generate your AI Spotify playlist with SpotiLab' />
            )}
        </>
    )
}
