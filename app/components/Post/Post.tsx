import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import Image from 'next/image';
import { SafeUser } from '@/app/types';
import { FcLike } from "react-icons/fc";
import socket from '@/app/libs/socket';
import { useRouter } from 'next/navigation';
import useEditPostModal from '@/app/hooks/useEditPostModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';

interface PostProps {
    id: string
    images: Array<string>
    profile?: boolean,
    likes: Array<string>,
    user: SafeUser,
    title: string | any,
    currentUser: SafeUser,
    updatedAt: Date,
    full?: boolean,
}

export default function Post({
    id,
    images,
    profile,
    likes,
    user,
    title,
    currentUser,
    updatedAt,
    full
}: PostProps) {

  const [likesState, setLikesState] = useState(likes);
  const [isLiked, setIsLiked] = useState(!likesState.some((id: string) => id == currentUser?.id));

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const editPostModal = useEditPostModal();

  const likePost = () => {
    if(!currentUser){
        return router.push('/login')
    }
    setLoading(true);
    socket.emit('like', {
        postId: id,
        userId: currentUser.id,

        idUser: user.id,
        user: currentUser,
    })
  }

  const unLikePost = () => {
    if(!currentUser){
        return router.push('/login')
    }
    setLoading(true);
    socket.emit('unLike', {
        postId: id,
        userId: currentUser.id,
    })
  }

  useEffect(() => {
    socket.on('receive-like', (obj) => {
        if(obj.postId == id){
            // if(!likesState.some((id: string) => id == currentUser.id)){
                setLikesState((prev) => [...prev, obj.userId])
                router.refresh();
                if(obj.userId == currentUser?.id){
                    setIsLiked(false)
                    setLoading(false)
                }
            // }
        }
    })

    socket.on('receive-unLike', (obj) => {
        if(obj.postId == id){
            // if(likesState.some((id: string) => id == currentUser.id)){
                setLikesState((prev) => prev.filter((id: string) => id != obj.userId))
                router.refresh();
                if(obj.userId == currentUser?.id){
                    setIsLiked(true);
                    setLoading(false);
                }
            // }
        }
    })
  }, [])

  const removePost = () => {
    setLoading(true)
    axios.post('/api/posts/remove', {
        postId: id,
    }).then(() => {
        toast.success("Post has been removed")
        setLoading(false)
        router.refresh();
    }).catch((err: any) => {
        toast.error("Something went wrong")
        setLoading(false)
        router.refresh();
    } )
  }


  return (
    <div className={`
        bg-white
        border 
        rounded-sm 
        ${full ? 
        'max-w-full w-[90%] mt-5' 
        : 
        'max-w-sm sm:max-w-md'
        }
        `}>
        <div className="flex justify-between items-center">
        <Link href={`/profile/${user.id}`} className='flex items-center px-4 py-3'>
            <Image width={100} height={100} className="h-8 w-8 rounded-full" alt='' src={user.avatarUrl || '/images/placeholder.jpg'}/>
            <div className="ml-3 ">
                <span className="text-sm font-semibold antialiased leading-tight flex justify-center items-center">{user.fullName} <p className='font-normal ml-1 opacity-50 text-sm'>{format(updatedAt, 'LLL. dd, hh:mm aa')}</p></span>
                <span className="text-gray-600 text-xs block">{title}</span>
            </div>
        </Link>
        {currentUser?.id == user?.id && (
            <div className='flex items-center md:gap-5 flex-col mr-2 md:mr-0 gap-2 md:flex-row md:px-4 py-3'>
                <button disabled={loading} onClick={() => {
                    editPostModal.setData({
                        title: title,
                        images: images,
                        postId: id,
                    });
                    editPostModal.onOpen();
                }}>
                    <Image width={24} height={24} className='w-[24px] h-[24px]' src={'/icons/edit.png'} alt='Edit'/>
                </button>
                <button disabled={loading} onClick={() => {
                    removePost();
                }}>
                    <Image width={24} height={24} className='w-[24px] h-[24px]' src={'/icons/delete.png'} alt='Delete'/>
                </button>
            </div>
        )}
        </div>

        <div>
            <Swiper
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    autoplay
                    pagination={{
                        clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className="mySwiper"
                    >
                    {images?.map((val: string, key: any) => (
                        <SwiperSlide key={key}>
                          <Link href={`/posts/${id}`}>
                            <Image
                                className={`
                                    ${profile ? '!h-[200px]' : '!h-[400px]'}
                                    ${full ? '!w-full !h-[500px]' : '!w-[500px] md:!w-[600px] md:!h-[400px]'}
                                    `}
                                style={{ objectFit: 'cover' }} 
                                src={val} 
                                width={full ? 800 : 800}
                                height={full ? 800 : 800}
                                alt="Post" 
                                />
                            </Link>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
        <div className="flex items-center justify-between mx-4 mt-3 mb-2">
        <div className="flex gap-5">
            {isLiked ? (
                <button disabled={loading} onClick={() => {
                    likePost()
                }}>
                    <Image width={24} height={24} className='w-[24px] h-[24px]' src={'/icons/love.png'} alt='Love'/>
                </button>
            ) : (
                <button disabled={loading} onClick={() => {
                    unLikePost()
                }}>
                    <Image width={24} height={24} className='w-[24px] h-[24px]' src={'/icons/heart.png'} alt='Heart'/>
                </button>
            )}
        </div>
        </div>
        <div className="font-semibold text-sm mx-4 mt-2 mb-4">{likesState.length} likes</div>
    </div>
  )
}
