import { handleCreateMonthly } from "@/lib/helpers"

export default function CronToggle({ name, title, description, checked, setChecked }:
    {
        name: string,
        title: string,
        description: string,
        checked: boolean,
        setChecked: any
    }
) {
    return (
        <div className='flex z-10 justify-center items-center py-2'>
            <div className="border-2 border-[#f33f81] border-opacity-40 backdrop-blur rounded-md md:w-[70%] w-[90%]">
                <div className="flex flex-row justify-between items-center p-4 gap-1">
                    <div className="flex flex-col">
                        <h1 className="text-gray-300 md:text-lg text-sm font-semibold">{title}</h1>
                        <h1 className="text-gray-400 md:text-md text-xs">{description}</h1>
                    </div>
                    <div>

                        <label className="relative inline-flex items-center mt-2 cursor-pointer">
                            <input type="checkbox" checked={checked} className="sr-only peer"
                                onChange={() => {
                                    setChecked(!checked)
                                    handleCreateMonthly(name)
                                }}
                            />
                            <div className="w-11 h-6 bg-[#a2285c] rounded-full peer peer-focus:ring-4 peer-focus:ring-[#7c1f44] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#f33f81]"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div >
    )
}