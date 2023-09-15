import { Montserrat, Bebas_Neue } from 'next/font/google'
import { useEffect, useRef, useState } from "react";

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '600',
    style: 'normal',
})

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function AIGen() {
    return (
        <>

            <div className='flex flex-col justify-center items-center'>
                <h1 className='text-xl md:text-2xl py-4 font-bold text-gray-400 text-center'>Write your playlist description here</h1>
                <textarea id="description" rows="4" class="block p-2.5 w-full md:w-3/4 text-md text-gray-400 bg-transparent rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="The playlist should contain HipHop and R&B songs from the 90s..."></textarea>
                <div className='flex justify-center items-center w-full md:w-3/4 py-4'>
                    <div className='flex flex-row items-center cursor-pointer text-gray-400 hover:text-gray-600 w-fit'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        <h1 className='text-sm'>Get inspired</h1>
                    </div>
                </div>

                <button
                    type="button"
                    className="inline-block rounded border-2 border-neutral-50 px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-gray-300 hover:text-black"
                    data-te-ripple-init>
                    Generate Playlist
                </button>
            </div>
        </>
    )
}
