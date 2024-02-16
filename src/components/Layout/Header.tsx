import { signOut, useSession } from "next-auth/react";
import { Bebas_Neue } from "next/font/google"
import Link from "next/link"
import { useRouter } from "next/router";


const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function Header() {

    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div className="z-50 mt-4">
            <Link href="/" className="flex flex-col gap-2 justify-center items-center mt-4 mb-2">
                <img src="/logo.png" alt="Sonic Lab Logo" width={75} height={75} />
                <h1 className={`font-bold text-4xl text-[#f33f81] opacity-80 ${bebas_neue.className}`}>Sonic Lab</h1>
            </Link>
            {router.pathname === '/profile' ? (
                <div className='absolute top-7 right-7 z-50'>
                    <div className='flex flex-row justify-center items-center pb-4'>

                        <button
                            type="button"
                            className=""
                            data-te-ripple-init
                            onClick={() => {
                                signOut();
                                sessionStorage.clear();
                            }}
                        >
                            <img src="/signout.png" alt="" className="w-6 h-6 md:w-7 md:h-7" />
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {session && (
                        <Link href='/profile' className='absolute top-7 right-7 z-50'>
                            <div className='flex flex-row justify-center items-center gap-2'>
                                <img
                                    src={session?.user?.image?.toString()!}
                                    alt="Profile image"
                                    className="rounded-full mx-auto w-8 h-8 md:w-10 md:h-10 shadow-2xl border-2 border-white transition duration-200 transform hover:scale-110 object-cover "
                                    width={10}
                                    height={10}
                                />
                            </div>
                        </Link>
                    )}
                </>
            )}
        </div>
    )
}