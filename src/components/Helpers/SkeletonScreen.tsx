export default function SkeletonScreen() {
    return (
        <>
            {Array.from({ length: 50 }).map((_, index) => (
                <div className="flex flex-col gap-4 w-full pb-4" key={index}>
                    <div
                        className="flex flex-row items-center justify-between gap-4 p-3 bg-[#282828] text-gray-200 rounded-md shadow-md dark:bg-gray-800"
                    >
                        <div className="flex flex-row gap-4 items-center">
                            <div className="h-16 w-16 md:h-20 md:w-20 bg-[#4e4e4e]"></div>
                            <div className="flex flex-col gap-2">
                                <div className="h-4 md:h-5 w-32 md:w-60 rounded-sm bg-[#4e4e4e]"></div>
                                <div className="h-3 md:h-4 w-22 md:w-44 rounded-sm bg-[#4e4e4e]"></div>
                                <div className="h-3 md:h-4 w-16 md:w-16 rounded-sm bg-[#4e4e4e]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}