'use client'
import useNotificationModal from '@/app/hooks/useNotificationModal'
import socket from '@/app/libs/socket';
import { SafeNotification, SafeUser } from '@/app/types';
import axios from 'axios';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaTrash } from "react-icons/fa";

interface NotificationModalProps {
    currentUser: SafeUser,
    removeNotify: () => void
}

export default function NotificationModal({
    currentUser,
    removeNotify
}: NotificationModalProps) {
  const notificationModal = useNotificationModal();
  const [notifications, setNotifications] = useState<any>(currentUser.notification);
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    socket.on('receive-notification', (obj) => {
        if(obj.userId == currentUser?.id){
            setNotifications((prev: any) => [...prev, {
                senderUser: obj.senderUser,
                content: obj.content,
                link: obj.link,
                updatedAt: obj.updatedAt
            }])
        }
    })
  }, [])

  return (
    <div className={`absolute sm:border-l z-50 left-0 w-full top-0 sm:w-3/4 md:w-2/6 transition-all ${notificationModal.isOpen ? 'flex' : 'hidden'} bg-gray-200 shadow max-h-[90vh] overflow-y-auto sm:max-h-screen h-[90vh] sm:h-screen`}>
      <div className='ml-5 w-full mr-5 py-5'>
        <div className='flex w-full justify-between items-center'>
            <h2 className='font-bold text-2xl'>Notifications</h2>
            <button onClick={() => {
                    setNotifications([]);
                    notificationModal.onClose();
                    removeNotify();
                    axios.post('/api/notification/remove', {
                        userId: currentUser.id
                    })
                }}>
                <FaTrash size={25}/>
            </button>
        </div>
        <div className='mt-5 gap-5 w-full flex flex-col'>
            {notifications.length != 0 ? (
                notifications.map((notification: SafeNotification, i: any) => (
                    <div key={i} className='flex justify-between w-full items-center gap-2'>
                        <div className='flex gap-2'>
                            <Image width={50} className='rounded-full w-[50px] h-[50px]' height={50} src={notification?.senderUser?.avatarUrl || '/images/placeholder.jpg'} alt=""/>
                            <div>
                                <p className='font-normal text-sm -mt-2 opacity-50 -mb-1'>{format(notification?.updatedAt, 'LLL. dd, hh:mm aa')}</p>
                                <h2 className='text-md mt-1 flex font-bold'>{notification?.senderUser?.fullName}</h2>
                                <p className='text-sm'>{notification?.content}</p>
                            </div>
                        </div>
                        <Link onClick={() => {
                            router.refresh();
                            notificationModal.onClose();
                        }} href={notification?.link} className='
                            px-4
                            py-2
                            bg-indigo-500
                            rounded-2xl
                            text-white
                        '>View</Link>
                    </div>
                )).reverse()
            ) : (
                <h2 className='mt-2'>Empty</h2>
            )} 
        </div>
      </div>
    </div>
  )
}
