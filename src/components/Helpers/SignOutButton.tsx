import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <div className='flex flex-row mt-4 justify-center items-center'>

            <button
                type="button"
                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black z-10"
                data-te-ripple-init
                onClick={() => {
                    signOut();
                    sessionStorage.clear();
                }}
            >
                Sign Out
            </button>
        </div>
    )
}