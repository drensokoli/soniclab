import { handleCreateMonthly } from "@/lib/helpers";
import { Tooltip } from "@material-tailwind/react"
import { useEffect, useState } from "react";

export default function MonthlyToggle() {

    const [createMonthly, setCreateMonthly] = useState(localStorage.getItem('createMonthly') === 'true' ? true : false);

    useEffect(() => {
        if (localStorage.getItem('createMonthly')) {
            setCreateMonthly(localStorage.getItem('createMonthly') === 'true' ? true : false);
        }
    }, [localStorage.getItem('createMonthly')])

    return (
        <div className='flex flex-row gap-2 justify-center items-center'>

            <h1 className='text-lg md:text-xl font-bold text-gray-300 text-center z-10'>Generate monthly playlists?</h1>
            <Tooltip
                content={
                    <div className='flex flex-col justify-center items-center w-[200px]'>
                        <h1 className='text-center'>
                            SonicLab will create a monthly playlist based on your top tracks of the last 4 weeks.
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
                        onChange={() => {
                            setCreateMonthly(!createMonthly)
                            handleCreateMonthly()
                        }}
                    />
                    <div className="w-11 h-6 bg-[#a2285c] rounded-full peer peer-focus:ring-4 peer-focus:ring-[#7c1f44] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f33f81]"></div>
                </label>
            </Tooltip>
        </div>
    )
}