import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { getRecentlyPlayedSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";
import View from "../Helpers/View";
import SongList from "../Helpers/SongList";

interface Song {
    id: string;
    name: string;
    artist: string;
    image: string;
    link: string;
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

    const [view, setView] = useState('card');

    const fetchSongs = async () => {
        const recentSongs = await getRecentlyPlayedSongs(refreshToken, spotifyClientId, spotifyClientSecret);
        const songsArray = recentSongs.map((recentSong: any) => ({
            id: recentSong.id,
            name: recentSong.name,
            artist: recentSong.artist,
            image: recentSong.image,
            link: recentSong.link
        }))
        setSongs(songsArray);
    };

    useEffect(() => {
        setLoading(true);
        fetchSongs();
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
            <div className="my-4">
                <div className="flex flex-row gap-2 items-center justify-end w-full">
                    <View setView={setView} />
                </div>
            </div>
            {view === 'card' ? (
                <SongCard songs={songs} />
            ) : (
                <SongList songs={songs} />
            )}
        </>
    )
}