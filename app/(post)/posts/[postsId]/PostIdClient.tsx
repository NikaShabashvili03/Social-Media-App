'use client'

import Comment from '@/app/components/Post/Comment'
import Post from '@/app/components/Post/Post'
import socket from '@/app/libs/socket'
import { SafeComment, SafePosts, SafeUser } from '@/app/types'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'

interface PostIdClientProps {
    post: SafePosts | any
    currentUser: SafeUser | any
}
export default function PostIdClient({
    post,
    currentUser
}: PostIdClientProps) {
    const { 
        register, 
        handleSubmit,
        reset,
        formState: {
          errors,
        },
      } = useForm<FieldValues>({
            defaultValues: {
              comment: '',
            },
      });
      const [comments, setComments] = useState(post.comments);
      const [loading, setLoading] = useState(false);
      const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setLoading(true);
        socket.emit('add-comment', {
            postId: post.id,
            user: currentUser,
            content: data.comment,
            updatedAt: new Date(),
            postUserId: post.user.id
        })
        reset()
      }

      useEffect(() => {
        socket.on('receive-comment', (obj) => {
            if(obj.postId == post.id){
                setComments((prev: any) => [...prev, {
                    user: obj.user,
                    id: obj.postId,
                    content: obj.content,
                    likes: [],
                    updatedAt: obj.updatedAt
                }])
                setLoading(false);
            }
        })
      }, [])

  return (
    <div className='flex w-full justify-center mb-[10%] sm:mb-0 items-center flex-col'>
      <Post updatedAt={post.updatedAt} full currentUser={currentUser} likes={post.likes} images={post.images} id={post.id} title={post.title} user={post.user}/>
      <div className="bg-white dark:bg-gray-900 w-[90%] py-8 lg:py-8 antialiased">
        <div className="max-w-full w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion ({comments.length})</h2>
            </div>
            {currentUser && (
                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                        <textarea {...register('comment', {required: true})}
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                            placeholder="Write a comment..."/>
                    </div>
                    <button disabled={loading} onClick={handleSubmit(onSubmit)} type="submit"
                        className="inline-flex bg-black items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800">
                        Post comment
                    </button>
                </form>
            )}

            {comments.map((comment: SafeComment, i: any) => (
                <Comment postId={post?.id} id={comment.id} currentUser={currentUser} likes={comment.likes} user={comment.user} content={comment.content} updatedAt={comment.updatedAt} key={i}/>
            )).reverse()}
        </div>
        </div>
    </div>
  )
}
