'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { SafeMessages, SafeUser } from '../types'
import { usePathname, useRouter } from 'next/navigation'
import { TbUser, TbMessageCircle, TbLocationSearch, TbHome, TbLogout2, TbLogin2, TbRegistered } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { signOut } from 'next-auth/react'
import NotificationModal from './modals/NotificationModal'
import useNotificationModal from '../hooks/useNotificationModal'
import socket from '../libs/socket'
import Image from 'next/image'

interface SidebarProps {
    children: React.ReactNode,
    currentUser: SafeUser | null,
    messages?: SafeMessages | any
  };
  
  
const Sidebar: React.FC<SidebarProps> = ({ children, messages, currentUser }) => {
    const pathname = usePathname();
    const notificationModal = useNotificationModal();
    const removeNotify = () => {
        setNotifications([])
    }
  
    const [notifications, setNotifications] = useState<any>(currentUser?.notification);
    const router = useRouter();

    useEffect(() => {
        router.refresh();
        socket.on('receive-notification', (obj) => {
            if(obj.userId == currentUser?.id){
                setNotifications((prev: any) => [...prev, { senderUser: obj.senderUser, content: obj.content}])
            }
        })

    }, [])
    return (
        <>
                <aside className="fixed bottom-0 sm:top-0  h-[10vh] w-screen sm:bottom-auto left-0 z-40  sm:w-32 sm:flex sm:justify-center md:justify-start md:w-64 sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-200 " aria-label="Sidebar">
                    <div className="h-full md:w-full flex justify-start items-center sm:flex-col sm:px-3 sm:pb-4 dark:bg-gray-800">
                        <div className="px-3 py-3 hidden sm:block lg:px-5 lg:pl-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-start rtl:justify-end">
                                    <Link href="/" className="flex ms-2 md:me-24">
                                        <Image width={100} height={100} src="/icons/logo.png" className="h-10 md:h-8 me-3" alt="FlowBite Logo" />
                                        <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap hidden md:block dark:text-white">InstaBook</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <ul className="flex gap-1 justify-between items-center w-full sm:block sm:space-y-2 sm:font-medium">
                            <li className='h-full block sm:hidden w-full sm:h-auto sm:w-auto'>
                                <Link href="/" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    group 
                                    ${pathname == '/' && 'bg-gray-200'}
                                    `}>
                                        <TbHome className='w-7 h-7 sm:w-7 sm:h-7'/>
                                    </Link>
                            </li>
                        {currentUser ? (
                            <>
                                <li className='h-full w-full sm:h-auto sm:w-auto'>
                                    <Link href="/profile" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    group 
                                    ${pathname == '/profile' && 'bg-gray-200'}
                                    `}>
                                        <TbUser className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                                        </div>
                                    </Link>
                                </li>
                                <li className='h-full w-full sm:h-auto sm:w-auto'>
                                    <Link href="/conversation" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    relative
                                    group 
                                    ${pathname == '/conversation' && 'bg-gray-200'}
                                    ${pathname == `/conversation${pathname?.replaceAll('/conversation/','/')}` && 'bg-gray-200'}
                                    `}>
                                        
                                        <TbMessageCircle className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="flex-1 ms-3 whitespace-nowrap">Chat</span>
                                            {messages.length != 0 && (<span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-white bg-red-500 rounded-full dark:bg-gray-700 dark:text-gray-300">{messages?.length}</span>)}
                                        </div>
                                        {messages.length != 0 && (<span className="inline-flex md:hidden top-3 right-3 items-center justify-center absolute px-2 ms-3 text-sm font-medium text-white bg-red-500 rounded-full dark:bg-gray-700 dark:text-gray-300">{messages?.length}</span>)}
                                    </Link>
                                </li>
                                <li className='h-full w-full sm:h-auto'>
                                    <button onClick={() => {notificationModal.isOpen ? notificationModal.onClose() : notificationModal.onOpen()}} className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-full 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    relative
                                    group 
                                    ${notificationModal.isOpen && 'bg-gray-200'}
                                    `}>
                                        
                                        <IoIosNotificationsOutline className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="ms-3 whitespace-nowrap">Notification</span>

                                            <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">{notifications?.length}</span>
                                        </div>
                                        <span className="inline-flex md:hidden top-3 right-3 items-center justify-center absolute px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">{notifications?.length}</span>
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='h-full w-full sm:h-auto sm:w-auto'>
                                    <Link href="/register" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    group 
                                    ${pathname == '/register' && 'bg-gray-200'}
                                    `}>
                                        
                                        <TbRegistered className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="flex-1 ms-3 whitespace-nowrap">Register</span>
                                        </div>
                                    </Link>
                                </li>
                                <li className='h-full w-full sm:h-auto sm:w-auto'>
                                    <Link href="/login" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    group 
                                    ${pathname == '/login' && 'bg-gray-200'}
                                    `}>
                                        
                                        <TbLogin2 className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="flex-1 ms-3 whitespace-nowrap">Login</span>
                                        </div>
                                    </Link>
                                </li>
                            </>
                        )}
                        <li className='h-full w-full sm:h-auto sm:w-auto'>
                                    <Link href="/search" className={`
                                    flex 
                                    justify-center 
                                    items-center
                                    w-full 
                                    h-full 
                                    sm:w-auto 
                                    sm:h-auto 
                                    p-5 
                                    text-gray-900 
                                    rounded-lg 
                                    dark:text-white 
                                    hover:bg-gray-100 
                                    dark:hover:bg-gray-700 
                                    group 
                                    ${pathname == '/search' && 'bg-gray-200'}
                                    `}>
                                        
                                        <TbLocationSearch className='w-7 h-7 sm:w-7 sm:h-7'/>
                                        <div className='hidden md:flex justify-between w-full items-center '>
                                            <span className="flex-1 ms-3 whitespace-nowrap">Search</span>
                                        </div>
                                    </Link>
                                </li>
                                {currentUser && (
                                        <li className='h-full w-full sm:h-auto'>
                                            <button onClick={() => {signOut()}} className={`
                                            flex 
                                            justify-center 
                                            items-center
                                            w-full 
                                            h-full 
                                            sm:w-full 
                                            sm:h-auto 
                                            p-5 
                                            text-gray-900 
                                            rounded-lg 
                                            dark:text-white 
                                            hover:bg-gray-100 
                                            dark:hover:bg-gray-700 
                                            group 
                                            `}>
                                                
                                                <TbLogout2 className='w-7 h-7 sm:w-7 sm:h-7'/>
                                                <div className='hidden md:flex justify-between w-full items-center '>
                                                    <span className="ms-3 whitespace-nowrap">SignOut</span>
                                                </div>
                                            </button>
                                        </li>
                            )}
                        </ul>
                    </div>
                </aside>

                <div className="relative sm:mb-0 sm:ml-32 md:ml-64">
                    {currentUser && <NotificationModal removeNotify={removeNotify} currentUser={currentUser}/>}
                    {children}
                </div>
        </>
  )
}

export default Sidebar;