import { Checkbox } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";

export default function SongCard({
    songs,
    setSongs,
    setRange
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
}) {

    let songLength: number;

    if (window.screen.width <= 640) {
        songLength = 17;
    } else if (window.screen.width > 640) {
        songLength = 35;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 sm:gap-4 gap-2">
            {songs.map((song, index) => (
                <div key={index} className="flex flex-col gap-2 text-left p-2 sm:p-3 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800">
                    <img src={song.image} alt={song.name} className="rounded-lg" />
                    <div className="flex flex-row justify-between items-start">
                        <div className="flex flex-col justify-between items-start w-full">
                            <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
                                <p className="sm:text-lg text-sm font-bold w-full">
                                    {index + 1}. {song.name.length > songLength ? song.name.slice(0, songLength) + '...' : song.name}
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
                </div>
            ))}
        </div>
    )
}