import { signOut } from "next-auth/react";

export default function SignOutButton() {
    const handleSignOut = () => {
        // Clear session storage
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        });

        // Sign out from NextAuth
        signOut();
    };

    return (
        <div className='flex flex-row justify-center items-center pb-4'>
            <button
                type="button"
                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black z-10"
                data-te-ripple-init
                onClick={handleSignOut}
            >
                Sign Out
            </button>

        </div>
    );
}
