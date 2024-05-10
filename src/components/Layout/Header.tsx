import { signOut, useSession } from "next-auth/react";
import { Bebas_Neue } from "next/font/google"
import Link from "next/link"
import UserDropDown from "../Helpers/UserDropDown";


const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function Header() {

    const { data: session } = useSession();

    return (
        <div className="z-50 mt-4">
            <div className="flex flex-col gap-2 justify-center items-center mt-4 mb-2">
                <Link href="/">
                    <img src="/logo.png" alt="Sonic Lab Logo" width={75} height={75} />
                </Link>
                {/* <Link href="/">
                    <h1 className={`font-bold text-4xl text-[#f33f81] opacity-80 ${bebas_neue.className}`}>Sonic Lab</h1>
                </Link> */}
            </div>
            {session && (
                <UserDropDown userImage={session?.user?.image?.toString()!} />
            )}
        </div>
    )
}