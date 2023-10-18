import { useEffect, useState } from "react";

export default function SongList({
    songs
}: {
    songs: {
        id: any;
        image: any;
        name: any;
        artist: any;
        show: boolean;
    }[]
}) {

    const [songArray, setSongArray] = useState(songs);

    function removeSong(songId: any) {
        const newSongs = songArray.filter((song) => song.id !== songId);
        console.log(newSongs);
        setSongArray(newSongs);
    }

    useEffect(() => {
        setSongArray(songs);
    }, [songs])

    return (
        <>

            <div className="flex flex-col gap-4 w-full">
                {songArray
                .filter((song) => song.show)
                .map((song, index) => (
                    <div
                        key={index}
                        className="flex flex-row items-center justify-between gap-4 p-3 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800"
                    >
                        <a
                            href={`https://open.spotify.com/track/${song.id}`}
                            target="_blank"
                            className="flex flex-row items-center gap-4"
                        >

                            <img src={song.image} alt={song.name} className="rounded-md md:h-20 h-16" />
                            <div className="flex flex-col">
                                <p className="text-lg font-bold">{song.name}</p>
                                <p className="text-gray-300">{song.artist}</p>
                            </div>
                        </a>
                        <button
                            type="button"
                            className="bg-[#cf387a] rounded-3xl p-2 inline-flex items-center justify-center text-white hover:bg-[#9c2a5b] z-100"
                            onClick={() => removeSong(song.id)}
                        >
                            <span className="sr-only">Close menu</span>
                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </>
    )
}