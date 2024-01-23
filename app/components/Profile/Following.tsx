import { SafeUser } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ActiveDot from '../ActiveDot'


interface FollowingProps {
    following: Array<SafeUser> | any,
}
export default function Following({
    following
}: FollowingProps) {
  return (
    <div className='flex justify-center items-center flex-col'>
        <h2 className='text-3xl mb-5 font-bold'>Following</h2>
        <main className='grid w-full px-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
        {following?.map((following: SafeUser, i: any) => {
            return (
                <Link href={`/profile/${following.id}`} key={i} className='flex bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 rounded-2xl justify-center gap-2 items-center'>
                    <div>
                        <Image width={50} height={50} className='rounded-full w-[50px] h-[50px]' src={following.avatarUrl || '/images/placeholder.jpg'} alt='Avatar Url'/>
                        <ActiveDot isActive={following.isActive} id={following.id}/>
                    </div>
                    <h2 className='text-md'>{following.fullName}</h2>
                </Link>
            )
        })}
        </main>
    </div>
  )
}
