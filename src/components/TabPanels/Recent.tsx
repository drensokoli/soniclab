import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { getRecentlyPlayedSongs } from "@/lib/spotify";
import SongCard from "../Helpers/SongCard";

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
            <SongCard songs={songs} />
        </>
    )
}