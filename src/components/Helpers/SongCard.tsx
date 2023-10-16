
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

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
                {songs.map((song, index) => (
                    <a
                        href={`https://open.spotify.com/track/${song.id}`}
                        target="_blank"
                        key={index}
                        className="flex flex-col gap-2 text-left p-4 bg-[#282828] text-gray-200 rounded-lg shadow-md dark:bg-gray-800"
                    >
                        <img src={song.image} alt={song.name} className="rounded-lg" />
                        <p className="text-lg font-bold">{song.name.length > 20 ? song.name.slice(0, 20) + '...' : song.name}</p>
                        <p className="text-gray-300">{song.artist}</p>
                    </a>
                ))}
            </div>
        </>
    )
}