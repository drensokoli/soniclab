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

export default function Monthly() {
    return (
        <>
            <div className='flex flex-col gap-4 justify-center items-center'>
                <div className='flex flex-row gap-4 justify-center items-center'>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                </div>
                <div className='flex flex-row gap-4 justify-center items-center'>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                    <div className='w-48 h-48 bg-gray-300 opacity-30'></div>
                </div>
            </div>
        </>
    )
}
