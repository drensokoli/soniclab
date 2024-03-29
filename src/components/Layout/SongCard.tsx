import { Checkbox } from "@material-tailwind/react";
import { Plus_Jakarta_Sans } from "next/font/google";
import RecommendSongs from "../Helpers/RecommendSongs";

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function SongCard({
    songs,
    setSongs,
    setRange,
    fetchRecommendation,
    fetchingRecommendation
}: {
    songs: {
        id: any;
        image: any;
        name: any;
        artist: any;
        artistId: any;
        show: boolean;
    }[];
    setSongs: any;
    setRange: any;
    fetchRecommendation: any;
    fetchingRecommendation: boolean;
}) {

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 sm:gap-4 gap-2">
                {songs.map((song, index) => (
                    <div key={index} className="flex flex-col gap-2 text-left p-2 sm:p-3 bg-[#282828] text-gray-200 rounded-md shadow-md dark:bg-gray-800 justify-around">
                        <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" className="flex flex-row justify-center items-center gap-1">
                            <img src={song.image} alt={song.name} className="" />
                        </a>
                        <div className="flex flex-col justify-between h-full">
                            <div className="flex flex-row justify-between items-start">
                                <div className="flex flex-col justify-between items-start w-full">
                                    <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
                                        <p className="sm:text-lg text-sm font-bold w-full">
                                            {index + 1}. {song.name}
                                        </p>
                                    </a>
                                    <a href={`https://open.spotify.com/artist/${song.artistId}`} target="_blank">
                                        <p className="sm:text-sm text-xs text-gray-300">{song.artist}</p>
                                    </a>
                                </div>
                                <div className="flex flex-row justify-between items-center">
                                    <Checkbox
                                        className="items-center justify-center"
                                        checked={song.show}
                                        color="pink"
                                        crossOrigin={undefined}
                                        onChange={() => { song.show = !song.show; setSongs([...songs]); setRange(songs.filter((song) => song.show).length) }}
                                    />
                                </div>

                            </div>
                            <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" className="flex flex-row justify-center items-center gap-1">
                                <img src="./spotify.png" alt="Spotify Icon" width={15} height={15} className="inline-block" />
                                <h1 className={`${jakarta.className} sm:text-sm text-xs py-1`}>PLAY ON SPOTIFY</h1>
                            </a>
                        </div>
                    </div>
                ))}

            </div>
            <div className="mt-4">
                <RecommendSongs fetchRecommendation={fetchRecommendation} fetchingRecommendation={fetchingRecommendation}/>
            </div>
        </div>
    )
}