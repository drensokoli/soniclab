import { signOut } from "next-auth/react";

export default function SignOutButton() {
    const handleSignOut = () => {
        // Clear localStorage
        localStorage.clear();

        // Clear sessionStorage
        sessionStorage.clear();

        // Clear cookies
        const cookies = document.cookie.split(";");
        for (let i =  0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu,  01 Jan  1970  00:00:00 GMT";
        }

        // Sign out and redirect
        signOut({ redirect: false });
        window.location.href = '/'; // Replace '/' with the path you want to redirect to
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
