import { Plus_Jakarta_Sans } from "next/font/google"

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function RecommendSongs({fetchRecommendation}: {fetchRecommendation: any}) {

    return (
        <div
            className="flex flex-col items-center justify-center gap-2 p-3 cursor-pointer border-2 border-[#f33f81] border-opacity-60 backdrop-blur text-gray-200 rounded-md shadow-md dark:bg-gray-800"
            onClick={() => fetchRecommendation()}
        >            <img src="./plus.png" alt="Add more songs" width={40} height={40} className="mt-4" />
            <div className="flex flex-row justify-center items-center gap-1">
                <img src="./spotify.png" alt="Spotify Icon" width={15} height={15} className="inline-block" />
                <h1 className={`${jakarta.className} text-xs py-1`}>RECOMMEND MORE SONGS</h1>
            </div>
        </div>
    )
}