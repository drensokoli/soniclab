
export default function SongList({
    songs
}: {
    songs: {
        id: any;
        image: any;
        name: any;
        artist: any;
    }[]
}) {

    return (
        <>

            <div className="flex flex-col gap-4 w-full">
                {songs.map((song, index) => (
                    <a
                        href={`https://open.spotify.com/track/${song.id}`}
                        target="_blank"
                        key={index}
                        className="flex flex-row items-center gap-4 p-3 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800"
                    >
                        <img src={song.image} alt={song.name} className="rounded-md md:h-20 h-16" />
                        <div className="flex flex-col">
                            <p className="text-lg font-bold">{song.name}</p>
                            <p className="text-gray-300">{song.artist}</p>
                        </div>
                    </a>
                ))}
            </div>
        </>
    )
}