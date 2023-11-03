import { useEffect, useState } from "react";
import { Checkbox } from "@material-tailwind/react";

export default function SongList({
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
        songLength = 1000;
    }

    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                {songs.map((song, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center justify-between gap-4 p-3 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800"
                    >
                        <div className="flex flex-row gap-4 items-center">
                            <img src={song.image} alt={song.name} className="rounded-md md:h-20 h-16" />
                            <div className="flex flex-col gap-2">
                                <div>
                                    <a href={`https://open.spotify.com/track/${song.id}`} target="_blank">
                                        <p className="text-sm sm:text-lg font-bold">
                                            {index + 1}. {song.name.length > songLength ? song.name.slice(0, songLength) + '...' : song.name}
                                        </p>
                                    </a>
                                    <a href={`https://open.spotify.com/artist/${song.artistId}`} target="_blank">
                                        <p className="sm:text-sm text-xs text-gray-300">{song.artist}</p>
                                    </a>
                                </div>
                                <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" className="flex flex-row justify-start items-center gap-1">
                                    <img src="./spotify.png" alt="Spotify Icon" width={15} height={15} className="inline-block" />
                                    <h1 className="text-sm">Spotify</h1>
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
                ))}
            </div>
        </>
    )
}