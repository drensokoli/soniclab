import { Plus_Jakarta_Sans } from "next/font/google"

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function RecommendSongs() {

    return (
        <div className="flex flex-col items-center justify-center gap-2 p-3 border-2 border-[#f33f81] backdrop-blur cursor-pointer text-gray-200 rounded-md shadow-md dark:bg-gray-800 z-10">
            <img src="./plus.png" alt="Add more songs" width={40} height={40} className="mt-4" />

            <div className="flex flex-row justify-center items-center gap-1">
                <img src="./spotify.png" alt="Spotify Icon" width={15} height={15} className="inline-block" />
                <h1 className={`${jakarta.className} text-xs py-1`}>RECOMMEND MORE SONGS</h1>
            </div>
        </div>
    )
}