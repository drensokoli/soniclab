import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { createSpotifyPlaylist, getRecentlyPlayedSongs, getRecommandations } from "@/lib/spotify";
import SongCard from "../Layout/SongCard";
import View from "../Helpers/View";
import SongList from "../Layout/SongList";
import Slider from "../Helpers/Slider";
import SpotifyBubble from "../Helpers/SpotifyBubble";
import SkeletonScreen from "../Helpers/SkeletonScreen";
import { Checkbox } from "@material-tailwind/react";

interface Song {
    id: string;
    name: string;
    artist: string;
    artistId: string;
    image: string;
    link: string;
    show: boolean;
}

export default function Recent({
    spotifyClientId,
    spotifyClientSecret,
    providerAccountId,
    refreshToken,
    setPlaylists
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    providerAccountId: string,
    refreshToken: string,
    setPlaylists: any,
}) {

    useEffect(() => {
        if (refreshToken) {
            fetchSongs(50);
        }
    }, [refreshToken]);

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [fetchingRecommendation, setFetchingRecommendation] = useState(false);

    const [recommandationPosition, setRecommandationPosition] = useState(0);

    const currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();

    const date = new Date(year, month, day).toLocaleString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });

    const [playlistName, setPlaylistName] = useState(`SonicLab Session Groove - ${date}`);

    const [view, setView] = useState('list');
    const [range, setRange] = useState(50);
    const [playlistId, setPlaylistId] = useState('');
    const [type, setType] = useState('session_playlists');
    const [max, setMax] = useState(50);
    const [selected, setSelected] = useState(true);
    const [selectAllText, setSelectAllText] = useState('Deselect All');

    const fetchRecommendation = async () => {
        setFetchingRecommendation(true);
        
        let seedTracks: string | any[] = [];
        let foundValidSeedTrack = false;
        let positionIncrement = 0;
    
        // Loop until a valid seed track is found
        while (!foundValidSeedTrack) {
            seedTracks = songs
                .filter(song => song.show)
                .slice(recommandationPosition + positionIncrement, recommandationPosition + positionIncrement + 5);
            
            // Check if any valid seed tracks are found
            if (seedTracks.length > 0) {
                foundValidSeedTrack = true;
            } else {
                // If no valid seed tracks are found, increment the position
                positionIncrement += 5;
            }
        }
    
        setRecommandationPosition(recommandationPosition + positionIncrement);
        const recommandations = await getRecommandations(refreshToken, spotifyClientId, spotifyClientSecret, seedTracks);
        const songsArray = recommandations.map((recommandation: any) => ({
            id: recommandation.id,
            name: recommandation.name,
            artist: recommandation.artists[0].name,
            artistId: recommandation.artists[0].id,
            image: recommandation.album.images[0].url,
            link: recommandation.link,
            show: true,
        }));
    
        setSongs([...songs, ...songsArray]);
        setFetchingRecommendation(false);
        setRange(songs.length + songsArray.length);
        setMax(songs.length + songsArray.length);
    }
    

    const selectAll = async () => {
        let updatedSongs: Song[] = [];
        if (!selected) {
            updatedSongs = songs.map((song) => {
                return {
                    ...song,
                    show: true,
                };
            });
        } else {
            updatedSongs = songs.map((song) => {
                return {
                    ...song,
                    show: false,
                };
            });
        }
        setSelected(!selected);
        setSelectAllText(!selected ? 'Deselect All' : 'Select All');
        setSongs(updatedSongs);
    }

    useEffect(() => {
        if (songs.filter((song) => song.show).length === songs.length) {
            setSelected(true);
            setSelectAllText('Deselect All');
        } else if (songs.filter((song) => song.show).length === 0) {
            setSelected(false);
            setSelectAllText('Select All');
        }
    }, [songs]);

    const fetchSongs = async (range: number) => {
        const recentSongs = await getRecentlyPlayedSongs(refreshToken, spotifyClientId, spotifyClientSecret, range);

        const idCounts = recentSongs.reduce((counts: { [id: string]: number }, song: any) => {
            counts[song.id] = (counts[song.id] || 0) + 1;
            return counts;
        }, {});

        const updatedSongs = recentSongs.map((song: any, index: number) => {
            if (idCounts[song.id] > 1 && index !== recentSongs.findIndex((s: any) => s.id === song.id)) {
                return null;
            }
            return { ...song, show: true };
        }).filter((song: any) => song !== null);

        setSongs(updatedSongs);
        setRange(updatedSongs.length);
        setMax(updatedSongs.length);
    };

    const handleRangeChange = (value: number) => {

        setRange(value);

        const updatedSongs = songs.map((song, index) => {
            if (index < value) {
                return {
                    ...song,
                    show: true,
                };
            }
            return {
                ...song,
                show: false,
            };
        });

        setSongs(updatedSongs);
    };

    const createPlaylistHandler = async () => {
        setLoading(true);

        try {
            const userId = sessionStorage.getItem('userId') as string;
            const description = sessionStorage.getItem('description') as string;
            const songIds = songs.filter((song) => song.show).map((song) => song.id);

            const playlistId = await createSpotifyPlaylist(
                providerAccountId,
                refreshToken,
                spotifyClientId,
                spotifyClientSecret,
                playlistName,
                songIds,
                userId,
                "Dive into the sounds of the moment with the SonicLab Session Groove. Your recent tracks in one place, delivered to you by SonicLab",
                type
            );

            setPlaylistId(playlistId);
            setRange(50);
            fetchSongs(50);
            setPlaylistName(`SonicLab Session Groove - ${date}`);

            // Retrieve the existing playlist IDs
            const playlists = JSON.parse(sessionStorage.getItem('playlists') || '[]') as { playlistName: string, playlistId: string, description: string, type: string, created_at: string }[];

            // Append the new playlist data
            playlists.push({ playlistName, playlistId, description, type, created_at: new Date().toISOString() });
            playlists.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setPlaylists(playlists);

            // Store the updated playlist data
            sessionStorage.setItem('playlists', JSON.stringify(playlists));

        } catch (error) {
            console.error(error);
        } finally {
            setTimeout(() => {
                setLoading(false);
            }, 500);
            setTimeout(() => {
                setPlaylistId('');
            }, 5000);
        }
    };


    if (!session) {
        return <NotSignedIn title='Please sign in to see your recently played songs' />
    }

    if (loading) {
        return <Loading
            height='h-[400px]'
            bgColor='transparent'
        />
    }

    return (
        <>
            <div>
                {playlistId && (<SpotifyBubble playlistId={playlistId} playlistName={playlistName} />)}
                <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-2">
                    <h1 className="text-gray-300 text-md md:text-xl text-center">Create a session playlist with your recently played songs</h1>
                    <input
                        id="description"
                        className=" block p-2.5 w-full md:w-4/5 text-md text-gray-300 bg-transparent rounded-lg border border-gray-200"
                        placeholder="Playlist Name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />

                </div>
            </div>
            <div className="flex flex-row justify-between w-full px-3 py-2">
                <div>
                    <View setView={setView} />
                </div>
                <div className="flex flex-row items-center">
                    <h1 className="text-gray-200 text-sm">{selectAllText}</h1>
                    <Checkbox
                        className="w-6 h-6 items-center justify-center"
                        checked={selected}
                        color="pink"
                        crossOrigin={undefined}
                        onChange={() => selectAll()}
                    />
                </div>
            </div>
            {songs.length > 0 ? (
                <div className="flex justify-center">
                    {view === 'card' ? (
                        <SongCard songs={songs} setSongs={setSongs} setRange={setRange} fetchRecommendation={fetchRecommendation} fetchingRecommendation={fetchingRecommendation} />
                    ) : (
                        <SongList songs={songs} setSongs={setSongs} setRange={setRange} fetchRecommendation={fetchRecommendation} fetchingRecommendation={fetchingRecommendation} />
                    )}
                </div>
            ) : (
                <SkeletonScreen />
            )}
            <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-2">
                <button
                    type="button"
                    className={`inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black ${!playlistName ? 'opacity-50' : ''}`}
                    data-te-ripple-init
                    onClick={() => {
                        createPlaylistHandler(); // scroll to top
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={!playlistName}
                >
                    Create Playlist
                </button>
            </div>
        </>
    )
}