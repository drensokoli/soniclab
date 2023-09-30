import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Profile() {
    const { data: session, status } = useSession();
    const user = session?.user?.name;

    return (
        <div className='flex flex-col justify-center items-center gap-6'>
            <div className='flex flex-row justify-center items-center gap-2'>
                <Image
                    src={session?.user?.image?.toString()!}
                    alt="Profile image"
                    className="rounded-full mx-auto w-12 h-12 shadow-2xl border-4 border-white transition duration-200 transform hover:scale-110 "
                    width={20}
                    height={20}
                />
                <h1 className='text-gray-300 text-lg text-bold z-10'>{user}</h1>
            </div>

            <button
                type="button"
                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                data-te-ripple-init
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </div>
    )
}