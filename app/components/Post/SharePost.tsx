"use client"

import useNewPostModal from '@/app/hooks/useNewPostModal'
import { SafeUser } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface SharePostProps {
    currentUser: SafeUser
}

export default function SharePost({
    currentUser
}:SharePostProps) {
  const newPostModal = useNewPostModal();
  return (
    <div className='w-full flex justify-center items-center'>
        <div className="bg-white mt-5 border rounded-2xl max-w-sm sm:max-w-md">
            <div className='py-4 px-2 flex gap-2 justify-center items-center'>
                <Link className='w-16 h-full' href={'/profile'}>
                <Image alt={'Profile Picture'} className='rounded-full h-10 w-10' width={100} height={100} src={currentUser?.avatarUrl || '/images/placeholder.jpg'}/>
                </Link>
                <button onClick={() => {
                    newPostModal.onOpen();
                }} className='w-[500px] flex items-center justify-start text-sm text-gray-800 pl-1 sm:pl-2 bg-gray-200 shadow-inner h-8 rounded-2xl'>{`${currentUser.firstName}, would you share your thoughts with us?`}</button>
            </div>
        </div>
    </div>
  )
}
