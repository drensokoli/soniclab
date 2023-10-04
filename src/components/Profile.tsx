import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react';
import { Tooltip, Button } from "@material-tailwind/react";

export default function Profile() {
    const { data: session, status } = useSession();
    const user = session?.user?.name;

    const [createMonthly, setCreateMonthly] = useState(sessionStorage.getItem('createMonthly') === 'true' ? true : false);

    async function handleCreateMonthly() {

        const createMonthly = sessionStorage.getItem('createMonthly') === 'true' ? false : true;
        // const createMonthlyBoolean = createMonthly === 'true' ? true : false;

        const response = await fetch('/api/checkMonthly', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: session?.user?.email,
                createMonthly: createMonthly,
            }),
        });

        const data = await response.json();

        setCreateMonthly(createMonthly);
        sessionStorage.setItem('createMonthly', createMonthly.toString());
        
        console.log(data.message);
    }


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
            <div className='flex flex-row gap-2 justify-center items-center'>

                <h1 className='text-lg md:text-xl font-bold text-gray-300 text-center'>Generate monthly playlists?</h1>
                <Tooltip
                    content={
                        <div className='flex flex-col justify-center items-center w-[200px]'>
                            <h1 className='text-center'>
                                SpotiLab will create a monthly playlist based on your top tracks of the last 4 weeks.
                            </h1>
                        </div>
                    }

                    placement="top"
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0, y: 25 },
                    }}>
                    <label className="relative inline-flex items-center mr-5 cursor-pointer">
                        <input type="checkbox" checked={createMonthly} className="sr-only peer"
                            onChange={() => { handleCreateMonthly() }}
                        />
                        <div className="w-11 h-6 bg-[#a2285c] rounded-full peer peer-focus:ring-4 peer-focus:ring-[#7c1f44] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f33f81]"></div>
                    </label>
                </Tooltip>
            </div>
            <button
                type="button"
                className="inline-block rounded border-2 border-[#f33f81] px-6 py-2 text-xs font-bold uppercase leading-normal text-gray-300 transition duration-150 ease-in-out hover:bg-[#f33f81] hover:text-black"
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