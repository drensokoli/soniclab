import { useSession } from 'next-auth/react';
import { useEffect, useState } from "react";
import { createAIPlaylist, searchSongs } from '../../lib/spotify';
import Loading from '../Helpers/Loading';
import AIGenForm from './AIGenForm';
import PlaylistCreator from './PlaylistCreator';
import NotSignedIn from '../Layout/NotSignedIn';
import SpotifyBubble from '../Helpers/SpotifyBubble';

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

    const type = "ai_gen_playlists";

    function getSongs(response: any): string[] {
        const songs = response.songs;
        const songNames: string[] = [];

        for (let i = 0; i < songs.length; i++) {
            const song = songs[i];
            const name = song.name.replace(/ /g, '%20');
            const artist = song.artist.replace(/ /g, '%20');
            const feature = song.feature ? `%20feat.%20${song.feature.replace(/ /g, '%20')}` : '';
            const songName = `track:${name}%20artist:${artist}${feature}&type=track`;
            songNames.push(songName);
        }

        return songNames;
    }

    function getPlaylistNames(response: any): string[] {
        const playlistNames = response.playlistNames;
        return playlistNames;
    }

    const fetchSongIds = async () => {

        setLoading(true);

        try {

            const response = {
                "songs": [
                    {
                        "name": "Inside My Love",
                        "artist": "Minnie Riperton",
                        "feature": null
                    },
                    {
                        "name": "Everybody Dies",
                        "artist": "J. Cole",
                        "feature": null
                    },
                    {
                        "name": "Heather",
                        "artist": "Billy Cobham",
                        "feature": null
                    },
                    {
                        "name": "93 'til Infinity",
                        "artist": "Souls of Mischief",
                        "feature": null
                    },
                    {
                        "name": "Never Too Much / What's The Use (Tom Misch Arrangement)",
                        "artist": "Nic Kierstead",
                        "feature": null
                    },
                    {
                        "name": "What's the Use?",
                        "artist": "Mac Miller",
                        "feature": null
                    },
                    {
                        "name": "Between the Sheets",
                        "artist": "The Isley Brothers",
                        "feature": null
                    },
                    {
                        "name": "Big Poppa",
                        "artist": "The Notorious B.I.G.",
                        "feature": null
                    },
                    {
                        "name": "Funky Worm",
                        "artist": "Ohio Players",
                        "feature": null
                    },
                    {
                        "name": "Regulate",
                        "artist": "Warren G",
                        "feature": "Nate Dogg"
                    },
                    {
                        "name": "I Keep Forgettin'",
                        "artist": "Michael McDonald",
                        "feature": null
                    }
                ],
                "playlistNames": [
                    "Sampled Soul: Hip-Hop Chronicles",
                    "R&B Resampled: The Golden Era",
                    "Soulful Hip-Hop Journeys",
                    "Old R&B Revival: Hip-Hop Remakes",
                    "Rhythms of the Past: Hip-Hop Edition",
                    "Soulful Sampling Spectacle",
                    "Hip-Hop's R&B Roots",
                    "Timeless Beats and Melodies"
                ]
            }


            const songNames = getSongs(response);

            const playlistNames = getPlaylistNames(response);

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
            const checkMonthly = sessionStorage.getItem('createMonthly') as any;

            // Add await here to wait for the playlistId
            const playlistId = await createAIPlaylist(
                providerAccountId,
                refreshToken,
                spotifyClientId,
                spotifyClientSecret,
                playlistName,
                songIds,
                userId,
                description,
                range,
            );

            setPlaylistId(playlistId);

            sessionStorage.removeItem('songIds');
            sessionStorage.removeItem('playlistNames');
            sessionStorage.removeItem('description');

            setSongIds([]);
            setRange(25);
            setDescription('');

            // Retrieve the existing playlist IDs
            const playlists = JSON.parse(sessionStorage.getItem('playlists') || '[]') as { playlistId: string, description: string, type: string }[];

            // Append the new playlist data
            playlists.push({ playlistId, description, type });

            // Store the updated playlist data
            sessionStorage.setItem('playlists', JSON.stringify(playlists));

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
            setTimeout(() => {
                setPlaylistId('');
                setPlaylistName('');
            }, 5000);
        }
    };

    function removeSongId(songIdToRemove: string) {
        setSongIds((prevSongIds) => prevSongIds.filter((songId) => songId !== songIdToRemove));
        // remove songId from session storage
        sessionStorage.setItem('songIds', JSON.stringify(songIds.filter((songId) => songId !== songIdToRemove)));
    };

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
                                <SpotifyBubble playlistId={playlistId} playlistName={playlistName} />
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
