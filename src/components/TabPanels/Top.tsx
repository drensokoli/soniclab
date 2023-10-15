    import { useSession } from "next-auth/react";
    import Loading from "../Helpers/Loading";
    import NotSignedIn from "../Layout/NotSignedIn";
    import { useEffect, useState } from "react";
    import { getTopSongs } from "@/lib/spotify";

    interface Song {
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

        const fetchSongs = async () => {
            const topSongs = await getTopSongs(refreshToken, spotifyClientId, spotifyClientSecret, 'short_term');
            console.log("TOP - ", topSongs);
            const songsArray = topSongs.map((topSong: any) => ({
                name: topSong.name,
                artist: topSong.artist.name,
                image: topSong.image,
                link: topSong.link
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                    {songs.map(song => (
                        <div key={song.link}>
                            <img src={song.image} alt={song.name} />
                            <p>{song.name}</p>
                            <p>{song.artist}</p>
                            <a href={song.link}>Play on Spotify</a>
                        </div>
                    ))}
                </div>
            </>
        )
    }