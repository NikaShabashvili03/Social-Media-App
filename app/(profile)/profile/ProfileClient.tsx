'use client'
import useEditModal from '@/app/hooks/useEditModal'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaShareAlt } from "react-icons/fa";
import { useUrl } from 'nextjs-current-url';
import { SafeUser } from '@/app/types';
import { useRouter } from 'next/navigation';
import Followers from '@/app/components/Profile/Followers';
import Following from '@/app/components/Profile/Following';
import Image from 'next/image';
import Posts from '@/app/components/Profile/Posts';
import useNewPostModal from '@/app/hooks/useNewPostModal';


enum Box {
    posts,
    followers,
    following,
}

interface ProfileClientProps {
    currentUser: SafeUser,
    usersByFollowers: Array<SafeUser> | any
    usersByFollowing: Array<SafeUser> | any
}
export default function ProfileClient({
    currentUser,
    usersByFollowers,
    usersByFollowing
}: ProfileClientProps) {
  const editModal = useEditModal();
  const newPostModal = useNewPostModal();

  const { href: currentUrl } = useUrl() ?? {};
  const [box, setBox] = useState(Box.posts);
  function copy(){
    navigator.clipboard.writeText(currentUrl + `/${currentUser?.id}`);
    toast.success('Copyed')
  }
  const router = useRouter();
  return (
   <>
     <div className="relative flex flex-col w-full min-w-0 mb-6 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-light/30 draggable">

        <div className="px-9 pt-9 flex-auto min-h-[70px] pb-0 bg-transparent">
            <div className="flex flex-wrap mb-6 xl:flex-nowrap">
            <div className="mb-5 mr-5">
                <div className="relative inline-block shrink-0 rounded-2xl">
                    <Image width={100} height={100} className="inline-block shrink-0 rounded-2xl w-[80px] h-[80px] lg:w-[160px] lg:h-[160px]" src={currentUser.avatarUrl || '/images/placeholder.jpg'} alt="image" />
                </div>
            </div>
            <div className="grow">
                <div className="flex flex-wrap items-start justify-between mb-2">
                <div className="flex flex-col">
                    <div className="flex items-center mb-2">
                    <a className="text-secondary-inverse hover:text-primary transition-colors duration-200 ease-in-out font-semibold text-[1.5rem] mr-1"> {currentUser.fullName} </a>
                    </div>
                    <div className="flex flex-wrap pr-2 mb-4 font-medium">
                    <a className="flex items-center mb-2 mr-5 text-secondary-dark hover:text-primary">
                        <span className="mr-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                            <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                        </svg>
                        </span> {currentUser.email} </a>
                    </div>
                </div>
                <div className="flex gap-5 flex-wrap my-auto">
                    <button onClick={() => {editModal.onOpen()}} className="inline-block px-6 py-3 text-base font-medium leading-normal text-center text-white align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-primary hover:bg-primary-dark active:bg-primary-dark focus:bg-primary-dark ">
                        Edit
                    </button>
                    <button onClick={() => {newPostModal.onOpen()}} className="inline-block px-6 py-3 text-base font-medium leading-normal text-center text-white align-middle transition-colors duration-150 ease-in-out border-0 shadow-none cursor-pointer rounded-2xl bg-orange-500 hover:bg-primary-dark active:bg-primary-dark focus:bg-primary-dark ">
                        New Post
                    </button>
                </div>
                </div>
                <div className="flex flex-wrap justify-between">
                <div className="flex flex-wrap items-center">
                <button onClick={() => {
                        setBox(Box.following)
                        router.refresh();
                    }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal ${box == Box.following && 'bg-neutral-200'}`}> {currentUser.following.length} Following </button>
                    <button onClick={() => {
                        setBox(Box.followers)
                        router.refresh();
                    }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal ${box == Box.followers && 'bg-neutral-200'}`}> {currentUser.followers.length} Followers </button>
                    <button onClick={() => {
                            setBox(Box.posts)
                            router.refresh();
                    }} className={`mr-3 mb-2 inline-flex items-center justify-center text-secondary-inverse rounded-full bg-neutral-100 hover:bg-neutral-200 transition-all duration-200 ease-in-out px-3 py-1 text-sm font-medium leading-normal ${box == Box.posts && 'bg-neutral-200'}`}> {currentUser.posts.length} Posts </button>
                </div>
                </div>
                <button onClick={() => copy()} className='mt-2 flex justify-start items-center gap-2'>
                    <FaShareAlt size={20}/>
                    <span>Share</span>
                </button>
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
            {box == Box.posts && <Posts currentUser={currentUser} posts={currentUser?.posts}/>}
            {box == Box.followers && <Followers followers={usersByFollowers}/>}
            {box == Box.following && <Following following={usersByFollowing}/>}
     </div>
   </>
  )
}
