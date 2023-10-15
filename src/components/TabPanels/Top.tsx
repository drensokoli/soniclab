import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { SetStateAction, useEffect, useState } from "react";
import { getTopSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";
import { Select, Option, select } from "@material-tailwind/react";

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

    const fetchSongs = async (timeRange: string) => {
        const topSongs = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, timeRange);
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
        fetchSongs(timeRange);
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
            <div className="my-4">
                <select
                    id="countries"
                    className="bg-gray-200 w-[200px] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={timeRange}
                    onChange={(e) => {
                        setTimeRange(e.target.value);
                        setLoading(true);
                        fetchSongs(e.target.value);
                        setLoading(false);
                    }}
                >
                    <option value="short_term">Short term</option>
                    <option value="medium_term">Medium term</option>
                    <option value="long_term">Long term</option>
                </select>
            </div>
            <SongCard songs={songs} />
        </>
    )

}