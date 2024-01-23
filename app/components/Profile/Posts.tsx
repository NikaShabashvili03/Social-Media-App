'use client'

import { SafePosts, SafeUser } from '@/app/types'
import React from 'react'
import Post from '../Post/Post'


interface PostsProps {
    posts: Array<SafePosts>,
    currentUser: SafeUser | any
}
export default function Posts({
    posts,
    currentUser
}: PostsProps) {
  return (
    <div className='flex justify-center mb-[10vh] items-center flex-col'>
        <h2 className='text-3xl mb-5 font-bold'>Posts</h2>
        <main className='grid w-full px-2 grid-cols-2 md:grid-cols-3 gap-5'>
        {posts?.map((post: SafePosts, i: any) => 
            <Post updatedAt={post.updatedAt} id={post.id} currentUser={currentUser} title={post.title} user={post.user} likes={post.likes} key={i} profile images={post.images}/>
        ).reverse()}
        </main>
    </div>
  )
}
