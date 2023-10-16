
export default function SongCard({
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

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 sm:gap-4 gap-2">
                {songs.map((song, index) => (
                    <a
                        href={`https://open.spotify.com/track/${song.id}`}
                        target="_blank"
                        key={index}
                        className="flex flex-col gap-2 text-left p-4 sm:p-3 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800"
                    >
                        <img src={song.image} alt={song.name} className="rounded-lg" />
                        <p className="sm:text-lg text-sm font-bold">{song.name.length > 19 ? song.name.slice(0, 19) + '...' : song.name}</p>
                        <p className="sm:text-sm text-xs text-gray-300">{song.artist}</p>
                    </a>
                ))}
            </div>
        </>
    )
}