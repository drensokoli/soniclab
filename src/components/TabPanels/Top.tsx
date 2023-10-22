import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { SetStateAction, useEffect, useState } from "react";
import { createSpotifyPlaylist, getTopSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";
import { Select, Option, select } from "@material-tailwind/react";
import SongList from "../Helpers/SongList";
import View from "../Helpers/View";
import Slider from "../Helpers/Slider";

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
    refreshToken
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    providerAccountId: string,
    refreshToken: string
}) {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [timeRange, setTimeRange] = useState('short_term');
    
    const [view, setView] = useState('card');
    const [range, setRange] = useState(50);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const monthName = monthNames[currentMonth - 1];
    const date = currentDate.getDate();
    const dateName = date + " " + monthName + " " + currentDate.getFullYear();

    let seasons = "";
    
    if (currentMonth >= 8 && currentMonth <= 10) {
        seasons = "Summer";
    } else if (currentMonth >= 11 || currentMonth <= 1) {
        seasons = "Autumn";
    } else if (currentMonth >= 2 && currentMonth <= 4) {
        seasons = "Winter";
    } else if (currentMonth >= 5 && currentMonth <= 7) {
        seasons = "Spring";
    }    

    const nameMatch: { [key: string]: string } = {
        short_term: `SpotiLab Monthly Mix - ${dateName}`,
        medium_term: `SpotiLab ${seasons} Collection`,
        long_term: "SpotiLab All Time Favorites"
    }

    const [playlistName, setPlaylistName] = useState(`${nameMatch[timeRange]}`);
    
    const [playlistId, setPlaylistId] = useState('');
    const [type, setType] = useState('top_playlists');
    
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
                "Top",
                "top_playlists"
            );

            setPlaylistId(playlistId);

            sessionStorage.removeItem('songIds');
            sessionStorage.removeItem('playlistNames');
            sessionStorage.removeItem('description');

            // setSongIds([]);
            setRange(50);
            fetchSongs(timeRange, 50);

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
        return <NotSignedIn title='Please sign in to see your recently played songs' />
    }


    if (loading) {
        return <Loading height='h-[400px]' bgColor='transparent' />
    }

    return (
        <>
            <div>
                <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-2">
                    <h1 className="text-gray-300 text-xl md:text-2xl text-center">Create a playlist with your top songs</h1>
                    <input
                        id="description"
                        className=" block p-2.5 w-full md:w-4/5 text-md text-gray-300 bg-transparent rounded-lg border border-gray-200"
                        placeholder="Playlist Name"
                        value={playlistName}
                        onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    <div className="w-full md:w-4/5">
                        <Slider
                            max={50}
                            range={range}
                            onChange={(value) => {
                                handleRangeChange(value);
                            }}
                        />
                    </div>
                    <button
                        type="button"
                        className={`inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black ${!playlistName ? 'opacity-50' : ''}`}
                        data-te-ripple-init
                        onClick={() => { createPlaylistHandler() }}
                        disabled={!playlistName}
                    >
                        Create Playlist
                    </button>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex items-center justify-end w-full py-4 gap-2">
                    <select
                        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={timeRange}
                        onChange={(e) => {
                            setTimeRange(e.target.value);
                            fetchSongs(e.target.value, 50);
                            setRange(50);
                            setPlaylistName(nameMatch[e.target.value]);
                        }}
                    >
                        <option value="short_term">Monthly Mix</option>
                        <option value="medium_term">Season Collection</option>
                        <option value="long_term">All Time Favorites</option>
                    </select>
                    <View setView={setView} />
                </div>
            </div>
            <div className="flex justify-center">
                {view === 'card' ? (
                    <SongCard songs={songs} setSongs={setSongs} setRange={setRange} />
                ) : (
                    <SongList songs={songs} setSongs={setSongs} setRange={setRange} />
                )}
            </div>
        </>
    )

}