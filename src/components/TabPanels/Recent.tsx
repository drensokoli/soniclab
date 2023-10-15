import { useSession } from "next-auth/react";
import Loading from "../Helpers/Loading";
import NotSignedIn from "../Layout/NotSignedIn";
import { useEffect, useState } from "react";
import { getRecentlyPlayedSongs } from "@/lib/spotify";

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
    const [songIds, setSongIds] = useState<string[]>([""]);

    const fetchSongs = async () => {
        const ids = await getRecentlyPlayedSongs(refreshToken, spotifyClientId, spotifyClientSecret);
        setSongIds(ids);
    }

    useEffect(() => {
        setLoading(true);
        fetchSongs();
        setLoading(false);
    }, [refreshToken, spotifyClientId, spotifyClientSecret])

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
            {loading ? (
                <Loading
                    height='h-[400px]'
                    bgColor='transparent'
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                        {songIds.map((id, index) => (
                            <iframe
                                key={id + '_' + index}
                                src={`https://open.spotify.com/embed/track/${id}`}
                                width="30%"
                                height="160"
                                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                loading="lazy"
                                className="w-full"
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    )
}