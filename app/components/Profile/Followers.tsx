import getUsersByFollowers from '@/app/actions/getUsersByFollowers'
import { SafeUser } from '@/app/types';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import Image from 'next/image';
import ActiveDot from '../ActiveDot';
import Link from 'next/link';
 


interface FollowersProps { 
    followers: Array<SafeUser> | any
}
export default function Followers({
    followers
}: FollowersProps) {
  return (
    <div className='flex justify-center items-center flex-col'>
        <h2 className='text-3xl mb-5 font-bold'>Followers</h2>
        <main className='grid w-full px-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
        {followers?.map((follower: SafeUser, i: any) => {
            return (
                <Link href={`/profile/${follower.id}`} key={i} className='flex bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 rounded-2xl justify-center gap-2 items-center'>
                    <div>
                        <Image width={50} height={50} className='rounded-full w-[50px] h-[50px]' src={follower.avatarUrl || '/images/placeholder.jpg'} alt='Avatar Url'/>
                        <ActiveDot isActive={follower.isActive} id={follower.id}/>
                    </div>
                    <h2 className='text-md'>{follower.fullName}</h2>
                </Link>
            )
        })}
    </main>
    </div>
  )
}