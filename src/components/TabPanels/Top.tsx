import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { createSpotifyPlaylist, getRecommandations, getTopSongs } from "@/lib/spotify";
import SongCard from "../Layout/SongCard";
import SongList from "../Layout/SongList";
import View from "../Helpers/View";
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

export default function Top({
    spotifyClientId,
    spotifyClientSecret,
    providerAccountId,
    refreshToken,
    setPlaylists,
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    providerAccountId: string,
    refreshToken: string,
    setPlaylists: any,
}) {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [timeRange, setTimeRange] = useState('short_term');
    const type = 'top_playlists';

    const [view, setView] = useState('list');
    const [range, setRange] = useState(50);
    const [max, setMax] = useState(50);

    const [fetchingRecommendation, setFetchingRecommendation] = useState(false);
    const [recommandationPosition, setRecommandationPosition] = useState(0);

    const [selected, setSelected] = useState(true);
    const [selectAllText, setSelectAllText] = useState('Deselect All');

    const currentDate = new Date();

    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    let year = currentDate.getFullYear();

    const date = new Date(year, month, day).toLocaleString('en-US', { month: 'short', year: 'numeric', day: 'numeric' });

    const nameMatch: { [key: string]: { name: string, description: string } } = {
        medium_term: {
            name: `SonicLab Half-Year Jam - ${date}`,
            description: `Relive your musical journey with the SonicLab Half-Year Jam. Your top ${range} tracks from the last 6 months, creating your personal symphony.`
        },
        short_term: {
            name: `SonicLab Monthly Mix - ${date}`,
            description: `Craft your own unique mixtape with the SonicLab Monthly Mix. Your top ${range} tracks from the past month, designed by you, delivered by SonicLab.`
        },
        long_term: {
            name: `SonicLab Timeless Gems - ${date}`,
            description: `Rediscover your musical history through SonicLab Timeless Gems. Your ${range} all-time favorite tracks, eternally cherished.`
        }
    };

    const [playlistName, setPlaylistName] = useState(nameMatch[timeRange].name);
    const [playlistId, setPlaylistId] = useState('');

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

    const fetchSongs = async (timeRange: string, range: number) => {
        const topSongs = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, timeRange, range);
        const songsArray = topSongs.map((topSong: any) => ({
            id: topSong.id,
            name: topSong.name,
            artist: topSong.artist,
            artistId: topSong.artistId,
            image: topSong.image,
            link: topSong.link,
            show: true,
        }))
        setSongs(songsArray);
    };

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

    const createPlaylistHandler = async () => {
        setLoading(true);

        try {
            const userId = sessionStorage.getItem('userId') as string;
            const songIds = songs.filter((song) => song.show).map((song) => song.id);
            const description = nameMatch[timeRange].description;

            const playlistId = await createSpotifyPlaylist(
                providerAccountId,
                refreshToken,
                spotifyClientId,
                spotifyClientSecret,
                playlistName,
                songIds,
                userId,
                description,
                type
            );

            setPlaylistId(playlistId);

            setRange(50);
            fetchSongs(timeRange, 50);
            setPlaylistName(nameMatch[timeRange].name);

            // Retrieve the existing playlist IDs
            const playlists = JSON.parse(sessionStorage.getItem('playlists') || '[]') as { playlistName: string, playlistId: string, description: string, type: string, created_at: string }[];

            // Append the new playlist data at the beginning
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

    useEffect(() => {
        setLoading(true);
        fetchSongs(timeRange, range);
        setLoading(false);
    }, [refreshToken, spotifyClientId, spotifyClientSecret]);

    if (!session) {
        return <NotSignedIn title='Please sign in to see your top songs' />
    }

    if (loading) {
        return <Loading height='h-[400px]' bgColor='transparent' />
    }

    return (
        <>
            <div>
                {playlistId && (<SpotifyBubble playlistId={playlistId} playlistName={playlistName} />)}
                <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-2">
                    <h1 className="text-gray-300 text-md md:text-xl text-center">Create a playlist with your monthly, half year, or all-time top tracks</h1>
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
                <div className="flex flex-row items-start gap-2">
                    <View setView={setView} />
                    <select
                        className="bg-gray-200 mt-1 border h-[38px] border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={timeRange}
                        onChange={(e) => {
                            setTimeRange(e.target.value);
                            fetchSongs(e.target.value, 50);
                            setRange(50);
                            setPlaylistName(nameMatch[e.target.value].name);
                        }}
                    >
                        <option value="short_term">Monthly</option>
                        <option value="medium_term">Seasonal</option>
                        <option value="long_term">All Time</option>
                    </select>
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