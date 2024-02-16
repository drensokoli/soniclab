import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { BsPersonFill, BsBoxArrowInRight } from 'react-icons/bs';

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export default function UserDropDown({ userImage }: { userImage: string }) {
    return (
        <Menu as="div" className='absolute top-7 right-7 z-50'>
            <div>
                <Menu.Button className="">
                    <img
                        src={userImage}
                        alt="Profile image"
                        className="rounded-full mx-auto w-8 h-8 md:w-10 md:h-10 shadow-2xl border-2 border-white transition duration-200 transform hover:scale-110 object-cover "
                        width={10}
                        height={10}
                    />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/profile"
                                    className={classNames(active ? 'bg-gray-100 hover:bg-gray-200' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    aria-label='Profile'
                                >
                                    <div className='flex flex-row justify-start items-center gap-1'>
                                        <BsPersonFill />
                                        <h1>Profile</h1>
                                    </div>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => signOut()}
                                    className={classNames(active ? 'bg-gray-100 hover:bg-gray-200 w-full' : '', 'block px-4 py-2 text-sm text-gray-700')}
                                    aria-label='Notion'
                                >
                                    <div className='flex flex-row justify-start items-center gap-1'>
                                        <BsBoxArrowInRight />
                                        <h1>Sign Out</h1>
                                    </div>
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
