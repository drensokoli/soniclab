import { signIn } from "next-auth/react";

export default function NotSignedIn({ title }: { title: string }) {

    return (
        <div className='flex flex-col justify-center items-center mt-40 text-center gap-6'>
            <h1 className='text-2xl md:text-3xl text-gray-300'>You are not signed in.</h1>
            <p className='text-lg md:text-xl text-gray-300'>{title}</p>
            <button
                type="button"
                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
                data-te-ripple-init
                onClick={() => signIn('spotify')}
            >
                Sign In
            </button>
        </div>
    );
}