import { useSession } from "next-auth/react";
import { Bebas_Neue } from "next/font/google"
import Link from "next/link"


const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function Header() {

    const { data: session } = useSession();
    const user = session?.user?.name;

    return (
        <div className='flex flex-col justify-center items-center h-1/4 pb-4 pt-16 z-10 gap-4'>
            <Link href="/">
                <h1 className={`sm:text-8xl font-bold text-7xl text-[#f33f81] opacity-70 ${bebas_neue.className}`}>Sonic Lab</h1>
            </Link>
            {session && (
                <Link href='/profile' className='flex flex-row justify-center items-center gap-2'>
                    <img
                        src={session?.user?.image?.toString()!}
                        alt="Profile image"
                        className="rounded-full mx-auto w-12 h-12 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 object-cover "
                        width={20}
                        height={20}
                    />
                    <h1 className='text-gray-300 text-lg text-bold z-10'>{user}</h1>
                </Link>
            )}
        </div>
    )
}