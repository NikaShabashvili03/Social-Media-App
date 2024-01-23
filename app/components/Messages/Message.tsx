import React from 'react'
import {format} from 'date-fns'
import { SafeUser } from '@/app/types'
import Image from 'next/image';

interface MessageProps {
    myMessage?: boolean,
    message: string,
    date: Date,
    user: SafeUser,
    seen?: boolean,
    images?: any
}
export default function Message({
    myMessage,
    message,
    date,
    user,
    seen,
    images
}: MessageProps) {
  if(myMessage){
    return (
        <div className='w-full'>
            <div className="chat chat-end">
                    <div className="chat-header">
                        <time className="text-xs opacity-50">{format(date, "hh:mm")}</time>
                    </div>
                    <div className='chat-bubble break-all'>
                        <div className={`grid gap-5 ${images?.length == 1 ? 'grid-cols-1': 'grid-cols-2'}`}>
                            {images?.length != 0 && message.length == 0 && (
                                images?.map((url: string, i: any) => (
                                    <>
                                        <Image key={i} src={url} alt='' className={` ${images?.length == 1 ? 'w-[200px] h-[200px]' : 'w-[100px] h-[100px]'}`} width={300} height={300}/>
                                    </>
                                ))
                                )}
                            </div>
                            {images?.length == 0 && message.length != 0 && (
                                <h2 className='w-auto break-all'>{message}</h2>
                            )}
                            {images?.length != 0 && message.length != 0 && (
                                <>
                                    <h2 className='mb-2 w-auto break-all'>{message}</h2>
                                    <div className={`grid gap-5 ${images?.length == 1 ? 'grid-cols-1': 'grid-cols-2'}`}>
                                        {images?.map((url: string, i: any) => (
                                            <Image key={i} src={url} alt='' className={` ${images?.length == 1 ? 'w-[200px] h-[200px]' : 'w-[100px] h-[100px]'}`} width={300} height={300}/>
                                        ))}
                                    </div>
                                </>
                            )}
                </div>
                    {seen && (
                        <div className="chat-footer opacity-50">
                            Seen
                        </div>
                    )}
            </div> 
         </div>
    )
  }
  return (
   <div className='w-full '>
        <div className="chat chat-start">
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <Image width={100} height={100} alt="Tailwind CSS chat bubble component" src={user.avatarUrl || '/images/placeholder.jpg'} />
                </div>
            </div>
            <div className="chat-header">
                <time className="text-xs opacity-50">{format(date, "hh:mm")}</time>
            </div>
            <div className='chat-bubble break-all'>
                        <div className={`grid gap-5 ${images?.length == 1 ? 'grid-cols-1': 'grid-cols-2'}`}>
                            {images?.length != 0 && message.length == 0 && (
                                images?.map((url: string, i: any) => (
                                    <>
                                        <Image key={i} src={url} alt='' className={` ${images?.length == 1 ? 'w-[200px] h-[200px]' : 'w-[100px] h-[100px]'}`} width={300} height={300}/>
                                    </>
                                ))
                            )}
                        </div>
                        {images?.length == 0 && message.length != 0 && (
                            <h2 className='w-auto break-all'>{message}</h2>
                        )}
                        {images?.length != 0 && message.length != 0 && (
                            <>
                                <h2 className='mb-2 w-auto break-all'>{message}</h2>
                                <div className={`grid gap-5 ${images?.length == 1 ? 'grid-cols-1': 'grid-cols-2'}`}>
                                    {images?.map((url: string, i: any) => (
                                        <Image key={i} src={url} alt='' className={` ${images?.length == 1 ? 'w-[200px] h-[200px]' : 'w-[100px] h-[100px]'}`} width={300} height={300}/>
                                    ))}
                                </div>
                            </>
                        )}
            </div>
            {seen && (
                <div className="chat-footer opacity-50">
                    Seen
                </div>
            )}
        </div>
   </div>
  )
}


