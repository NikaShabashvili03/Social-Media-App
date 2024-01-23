'use client'
import ActiveDot from '@/app/components/ActiveDot'
import Followers from '@/app/components/Profile/Followers'
import Following from '@/app/components/Profile/Following'
import Posts from '@/app/components/Profile/Posts'
import socket from '@/app/libs/socket'
import { SafeUser } from '@/app/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface ProfileClientIdProps {
    user: SafeUser
    currentUser: SafeUser | null,
    usersByFollowers: Array<SafeUser> | any
    usersByFollowing: Array<SafeUser> | any
}

enum Box {
    posts,
    followers,
    following,
}

export default function ProfileIdClient({
    user, 
    currentUser,
    usersByFollowers,
    usersByFollowing
}: ProfileClientIdProps) {
  const [box, setBox] = useState(Box.posts);
  const [followers, setFollowers] = useState(user.followers);
  const [following, setFollowing] = useState(user.following);

  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const FollowBack = () => {
    setLoading(true)
    socket.emit('follow-back', {
        userId: user?.id,
        currentId: currentUser?.id,
        user: currentUser
    })
  }
  const Follow = () => {
    setLoading(true)
    socket.emit('follow', {
        userId: user?.id,
        currentId: currentUser?.id,
        user: currentUser
    })
  }

  const unFollow = () => {
    setLoading(true)
    socket.emit('unFollow', {
        userId: user?.id,
        currentId: currentUser?.id
    })
  }

  useEffect(() => {
    socket.on('receive-follow', (obj) => {
        if(obj.userId == user.id){
            setFollowers((prev: any) => [...prev, obj.currentId]);
            setLoading(false);
        }
        if(obj.currentId == user.id){
            setFollowing((prev: any) => [...prev, obj.userId]);
            setLoading(false);
        }
    })

    socket.on('receive-unFollow', (obj) => {
        if(obj.userId == user.id){
            setFollowers(followers.filter((foll: any) => foll != obj.currentId));
            setLoading(false);
        }
        if(obj.currentId == user.id){
            setFollowing(followers.filter((foll: any) => foll != obj.userId));
            setLoading(false);
        }
    })
  },[])

  return (
    <>
        <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 draggable">
            <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
                <div className="flex flex-wrap mb-6 xl:flex-nowrap">
                <div className="mb-5 mr-5">
                    <div className="relative inline-block shrink-0 rounded-2xl">
                    <Image width={100} height={100} className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]" src={user.avatarUrl || '/images/placeholder.jpg'} alt="image" />
                     <ActiveDot id={user.id} isActive={user.isActive}/>
                    </div>
                </div>
                <div className="grow">
                    <div className="flex flex-wrap items-start justify-between mb-2">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-2">
                        <a className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1"> {user.fullName} </a>
                        </div>
                        <div className="flex flex-wrap pr-2 mb-4 font-medium">
    
                        <a className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                            <span className="mr-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>
                            </span> {user.email} </a>
                        </div>
                    </div>
                    <div className="flex flex-wrap my-auto">
                        {currentUser && (
                            <button onClick={() => {
                                {followers.some((id: string) => id == currentUser?.id) ? unFollow() : following.some((id: string) => id === currentUser?.id) ? FollowBack() : Follow()}
                            }} disabled={isLoading} className="inline-block px-6 py-3 text-base font-medium leading-normal text-center text-white align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-primary hover:bg-primary-dark active:bg-primary-dark focus:bg-primary-dark ">
                                {followers.some((id: string) => id == currentUser?.id) ? 'Following' : following.some((id: string) => id === currentUser?.id) ? 'Follow Back' : 'Follow'}
                            </button>
                        )}
                    </div>
                    </div>
                    <div className="flex flex-wrap justify-between">
                    <div className="flex flex-wrap items-center">
                        <button onClick={() => {
                            setBox(Box.following)
                            router.refresh();
                        }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal ${box == Box.following && 'bg-neutral-200'}`}> {following.length} Following </button>
                        <button onClick={() => {
                            setBox(Box.followers)
                            router.refresh();
                        }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal  ${box == Box.followers && 'bg-neutral-200'}`}> {followers.length} Followers </button>
                        <button onClick={() => {
                            setBox(Box.posts)
                            router.refresh();
                        }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal ${box == Box.posts && 'bg-neutral-200'}`}> {user.posts.length} Posts </button>
                    </div>
                    </div>
                </div>
                </div>
                <hr className="w-full h-px border-neutral-200"/>
                <ul className="group flex flex-wrap items-stretch text-[1.15rem] font-semibold list-none border-b-2 border-transparent border-solid active-assignments">
                    <li className="flex mt-2 cursor-pointer -mb-[2px]" onClick={() => {
                        setBox(Box.posts)
                        router.refresh();
                        }}>
                        <a aria-controls="assignments" className={`
                        ${box == Box.posts && 'group-[.active-assignments]:text-primary group-[.active-assignments]:border-primary'}
                        py-5 mr-1 sm:mr-3 lg:mr-10 transition-colors duration-200 ease-in-out border-b-2 border-transparent text-muted hover:border-primary
                        `}> Posts </a>
                    </li>
                </ul>
            </div>
        </div>
        <div>
            {box == Box.posts && <Posts currentUser={currentUser} posts={user?.posts}/>}
            {box == Box.followers && <Followers followers={usersByFollowers}/>}
            {box == Box.following && <Following following={usersByFollowing}/>}
        </div>
    </>
  )
}
