import { Bebas_Neue } from "next/font/google"
import Link from "next/link"

const bebas_neue = Bebas_Neue({
    subsets: ['latin'],
    weight: '400',
    style: 'normal',
})

export default function BackButton() {
    return (
        <Link href='/' className='absolute md:top-7 top-3 md:left-9 left-4'>
            <button type="button" className=" text-white rounded-md border-gray-100 py-2 hover:text-white">
                <div className="flex flex-row align-middle">
                    <svg className="w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd"></path>
                    </svg>
                    <p className={`${bebas_neue.className} text-2xl`}>HOME</p>
                </div>
            </button>
        </Link>
    )
}