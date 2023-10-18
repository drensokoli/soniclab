import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { getRecentlyPlayedSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";
import View from "../Helpers/View";
import SongList from "../Helpers/SongList";
import Slider from "../Helpers/Slider";

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    link: string;
    show: boolean;
}

export default function Recent({
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
    const [playlistName, setPlaylistName] = useState('');

    const [view, setView] = useState('card');
    const [range, setRange] = useState(50);

    const fetchSongs = async (range: number) => {
        const recentSongs = await getRecentlyPlayedSongs(refreshToken, spotifyClientId, spotifyClientSecret, range);
        const songsArray = recentSongs.map((recentSong: any) => ({
            id: recentSong.id,
            name: recentSong.name,
            artist: recentSong.artist,
            image: recentSong.image,
            link: recentSong.link,
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

    useEffect(() => {
        setLoading(true);
        fetchSongs(range);
        setLoading(false);
    }, [refreshToken, spotifyClientId, spotifyClientSecret]);

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
                <div className="flex flex-col items-center justify-center gap-4 pt-8 pb-2">
                    <h1 className="text-gray-300 text-xl md:text-2xl text-center">Create a session playlist with your recently played songs</h1>
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
                </div>
            </div>
            <div className="flex flex-row justify-center">
                <div className="flex items-center justify-end w-full py-4">
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