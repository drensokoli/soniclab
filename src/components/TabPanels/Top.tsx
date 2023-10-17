import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { SetStateAction, useEffect, useState } from "react";
import { getTopSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";
import { Select, Option, select } from "@material-tailwind/react";
import SongList from "../Helpers/SongList";
import View from "../Helpers/View";
import Slider from "../Helpers/Slider";

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    link: string;
}

export default function Top({
    spotifyClientId,
    spotifyClientSecret,
    refreshToken
}: {
    spotifyClientId: string,
    spotifyClientSecret: string,
    refreshToken: string
}) {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [timeRange, setTimeRange] = useState('short_term');
    const [playlistName, setPlaylistName] = useState('');

    const [view, setView] = useState('card');
    const [range, setRange] = useState(50);

    const fetchSongs = async (timeRange: string, range: number) => {
        const topSongs = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, timeRange, range);
        const songsArray = topSongs.map((topSong: any) => ({
            id: topSong.id,
            name: topSong.name,
            artist: topSong.artist,
            image: topSong.image,
            link: topSong.link
        }))
        setSongs(songsArray);
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
                                setRange(value);
                                fetchSongs(timeRange, value);
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-center items-center">
                <div className="flex items-center justify-end w-full py-4 gap-2">
                    <select
                        id="timeRange"
                        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={timeRange}
                        onChange={(e) => {
                            setTimeRange(e.target.value);
                            fetchSongs(e.target.value, range);
                        }}
                    >
                        <option value="short_term">Four weeks</option>
                        <option value="medium_term">Six months</option>
                        <option value="long_term">All time</option>
                    </select>
                    <View setView={setView} />
                </div>
            </div>
            <div className="flex justify-center">
                {view === 'card' ? (
                    <SongCard songs={songs} />
                ) : (
                    <SongList songs={songs} />
                )}
            </div>
        </>
    )

}