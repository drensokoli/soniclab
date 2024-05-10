import { Fragment, useRef, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { BsPersonFill, BsBoxArrowInRight, BsFillShareFill } from 'react-icons/bs';
import ShareModal from './ShareModal';
import { useRouter } from 'next/router';

export default function UserDropDown({ userImage }: { userImage: string }) {

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ')
    };

    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    const shareUrl = "https://soniclab.vercel.app";

    return (
        <Menu as="div" className='absolute top-7 right-7 z-50'>
            <div>
                <Menu.Button>
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
                                    className={classNames(active ? 'w-full bg-gray-100 hover:bg-gray-200' : '', 'w-full block px-4 py-2 text-sm text-gray-700')}
                                    aria-label='Profile'
                                    onClick={() => setOpen(true)}
                                >
                                    <div className='flex flex-row justify-start items-center gap-1'>
                                        <BsFillShareFill />
                                        <h1>Share</h1>
                                    </div>
                                </button>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => signOut()}
                                    className={classNames(active ? 'bg-gray-100 hover:bg-gray-200 w-full' : '', 'block px-4 py-2 text-sm text-gray-700 w-full')}
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

            {/* SHARE MODAL */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    initialFocus={cancelButtonRef}
                    onClose={setOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                    </Transition.Child>
                    <div className="fixed inset-0 z-10 w-screen">
                        <div className="flex min-h-full items-center justify-center text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full mx-4 sm:w-[500px]">
                                    <ShareModal setOpen={setOpen} shareUrl={shareUrl} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </Menu>
    )
}