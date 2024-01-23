'use client'
import React from 'react'
import Post from './Post/Post'
import { SafePosts, SafeUser } from '../types'


interface PostFeedProps {
  AllPosts: Array<SafePosts> | any,
  currentUser: SafeUser | any
}

export default function PostFeed({
  AllPosts,
  currentUser
}: PostFeedProps) {
  return (
    <div className='flex mb-[10vh] gap-5 w-full sm:mb-0 py-5  justify-center items-center flex-col'>
      {AllPosts?.map((post: SafePosts, i: any) => (
        <Post updatedAt={post.updatedAt} id={post.id} currentUser={currentUser} title={post.title} user={post.user} likes={post.likes} key={i} images={post.images}/>
      )).reverse()}
    </div>
  )
}
