import { useEffect, useState } from "react";
import { Checkbox } from "@material-tailwind/react";
import { Plus_Jakarta_Sans } from "next/font/google";
import RecommendSongs from "../Helpers/RecommendSongs";

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function SongList({
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

    let songLength: number;

    if (window.screen.width <= 640) {
        songLength = 17;
    } else if (window.screen.width > 640) {
        songLength = 1000;
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                {songs.map((song, index) => (
                    <>
                        <div
                            key={index}
                            className="flex flex-row justify-between p-3 bg-[#282828] text-gray-200 rounded-md shadow-md dark:bg-gray-800"
                        >
                            <div className="flex flex-row gap-4">
                                <img src={song.image} alt={song.name} className="h-20 w-20 object-cover" />
                                <div className="flex flex-col">
                                    <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
                                        <p className="text-sm sm:text-lg font-bold sm:w-auto">
                                            {index + 1}. {song.name}
                                        </p>
                                    </a>
                                    <a href={`https://open.spotify.com/artist/${song.artistId}`} target="_blank">
                                        <p className="sm:text-sm text-xs text-gray-300">{song.artist}</p>
                                    </a>
                                    <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" className="flex flex-row justify-start items-center gap-2 pt-2">
                                        <img src="./spotify.png" alt="Spotify Icon" width={17} height={17} className="inline-block" />
                                        <h1 className={`${jakarta.className} sm:text-sm text-xs`}>PLAY ON SPOTIFY</h1>
                                    </a>
                                </div>
                            </div>
                            <Checkbox
                                className="w-6 h-6 items-center justify-center"
                                checked={song.show}
                                color="pink"
                                crossOrigin={undefined}
                                onChange={() => { song.show = !song.show; setSongs([...songs]); setRange(songs.filter((song) => song.show).length) }}
                            />
                        </div>
                    </>
                ))}
                <RecommendSongs fetchRecommendation={fetchRecommendation} fetchingRecommendation={fetchingRecommendation} />
            </div>
        </>
    )
}