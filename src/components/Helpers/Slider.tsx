
export default function Slider({ max, range, onChange }: {
    max: number;
    range: number;
    onChange: (value: number) => void;

}) {
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(parseInt(e.target.value));
    };

    return (
        <>
            <div className='flex flex-row justify-center items-center text-center pb-4'>
                <h1 className='w-fit px-4 py-3 bg-[#f33f81] text-gray-200 rounded-lg'>
                    {range} songs
                </h1>
            </div>
            <input
                type='range'
                className='transparent h-[4px] w-full cursor-pointer accent-[#f33f81] border-transparent bg-neutral-200 dark:bg-neutral-600'
                id='customRange1'
                min={1}
                max={max}
                value={range}
                onChange={handleSliderChange}
            />
        </>
    );
};
