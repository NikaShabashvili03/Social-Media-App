import socket from '@/app/libs/socket'
import { SafeUser } from '@/app/types'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface CommentProps {
    id: string,
    user: SafeUser,
    content: string,
    updatedAt: Date,
    likes: Array<string>,
    currentUser: SafeUser,
    postId: string
}
export default function Comment({
    id,
    user,
    content,
    updatedAt,
    likes,
    currentUser,
    postId,
}: CommentProps) {

  const [likesState, setLikesState] = useState(likes);
  const [isLiked, setIsLiked] = useState(!likesState.some((id: string) => id == currentUser?.id));
  const [loading, setLoading] = useState(false); 
  const router = useRouter();
  
  const likeComment = () => {
    setLoading(true);
    if(!currentUser){
        return router.push('/login')
    }
    setLoading(true);
    socket.emit('like-comment', {
        commentId: id,
        userId: currentUser.id,

        idUser: user.id,
        user: currentUser,
        postId: postId
    })
  }

  const unLikeComment = () => {
    setLoading(true);
    if(!currentUser){
        return router.push('/login')
    }
    setLoading(true);
    socket.emit('unLike-comment', {
        commentId: id,
        userId: currentUser.id
    })
  }

  useEffect(() => {
    socket.on('receive-like-comment', (obj) => {
        if(obj.commentId == id){
                setLikesState((prev) => [...prev, obj.userId])
                router.refresh();
                if(obj.userId == currentUser?.id){
                    setIsLiked(false)
                    setLoading(false)
                }
        }
    })

    socket.on('receive-unLike-comment', (obj) => {
        if(obj.commentId == id){
                setLikesState((prev) => prev.filter((id: string) => id != obj.userId))
                router.refresh();
                if(obj.userId == currentUser?.id){
                    setIsLiked(true);
                    setLoading(false);
                }
        }
    })
  }, [])

  return (
    <article className="p-6 text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                            <Image
                                width={100} height={100}
                                className="mr-2 w-6 h-6 rounded-full"
                                src={user?.avatarUrl || '/images/placeholder.jpg'}
                                alt={user.fullName}/>{user.fullName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                {format(updatedAt, 'LLL. dd, yyyy, hh:mm aa')}
                                </p>
                    </div>

                </footer>
                <p className="text-gray-500 dark:text-gray-400">{content}</p>
                <div className="flex items-center mt-4 space-x-2">
                        {isLiked ? (
                            <button disabled={loading} onClick={() => {
                                likeComment()
                            }}>
                                <Image width={24} height={24} className='w-[20px] h-[20px]' src={'/icons/love.png'} alt='Love'/>
                            </button>
                        ) : (
                            <button disabled={loading} onClick={() => {
                                unLikeComment()
                            }}>
                                <Image width={24} height={24} className='w-[20px] h-[20px]' src={'/icons/heart.png'} alt='Heart'/>
                            </button>
                        )}
                        <h2>{likesState.length}</h2>
                </div>
    </article>
  )
}
