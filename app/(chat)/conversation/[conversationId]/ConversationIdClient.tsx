'use client'
import ActiveDot from '@/app/components/ActiveDot';
import Message from '@/app/components/Messages/Message';
import ImageUpload from '@/app/components/inputs/ImageUpload';
import socket from '@/app/libs/socket';
import { SafeConversation, SafeMessages, SafeUser } from '@/app/types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoIosArrowBack } from "react-icons/io";
import { TbMessageChatbot } from "react-icons/tb";
import { CiImageOn } from "react-icons/ci";
import { CldUploadWidget } from "next-cloudinary";
import { useCallback } from "react";
import Image from 'next/image';
import { CiCircleRemove } from "react-icons/ci";


declare global {
    var cloudinary: any
}
  
const uploadPreset = "upusueif";


interface ConversationClientIdProps {
    conversation: SafeConversation
    currentUser: SafeUser
    users: Array<SafeUser>
    allConversation: Array<SafeConversation>
}

export default function ConversationIdClient({
    conversation, 
    currentUser, 
    users,
    allConversation
}: ConversationClientIdProps) {
    const { 
        register, 
        handleSubmit,
        reset,
        formState: {
            errors,
        },
    } = useForm<FieldValues>({
        defaultValues: {
            text: '',
        },
    });
 
  
  const [image, setImage] = useState<any>([]);
  const pathname = usePathname();

  const router = useRouter();
  const [messages, setMessages] = useState(conversation.messages);
  const [isLoading, setLoading] = useState(false);
  const messagesEndRef = useRef<any>(null) 

  const handleUpload = useCallback((result: any) => {
    setImage((prev: any) => [...prev, result.info.secure_url]);
  }, [setImage]);


  const onSubmit:SubmitHandler<FieldValues> = (data) => {
        setLoading(true)
        socket.emit('send-message', {
            id: "40cf921ad850b3870220b919",
            message: data.text,
            conversationId: conversation?.id,
            userId: currentUser?.id,
            updatedAt: new Date(),
            user: currentUser,
            images: image
        })
        reset();
        setImage([]);
        setInterval(() => {
            setLoading(false);
        }, 1000)
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const openConversation = (id: string) => {
        router.replace(`/conversation/${id}`)
  }

  const seen = () => {
    socket.emit('message-seen', {
        messageIds: messages.filter((mes: any) => mes.userId != currentUser?.id).map((itm: any) => itm.id),
        messages: messages.filter((mes: any) => mes.userId != currentUser?.id)
    })
  }

  useEffect(() => {
    seen();
  },[messages])

  useEffect(() => {
    scrollToBottom();
    seen();
    router.refresh();
    socket.on('receive-message', (obj) => {
        if(obj.conversationId == conversation.id){
            setMessages((prev: any) => [...prev, {
                id: obj.id,
                conversationId: obj.conversationId,
                message: obj.message,
                images:  obj.images,
                userId: obj.userId,
                updatedAt: obj.updatedAt,
                user: obj.user,
                seen: false,
            }])
            scrollToBottom();
        }
    })
  },[])


  useEffect(() => {
    socket.on('receive-message-seen', (obj) => {
        if(obj.messages.some((itm: any) => itm.userId == currentUser.id)){
            setMessages((prev: any) => prev.map((mess: any) => {
                if(obj?.messageIds?.some((itm: any) => itm == mess.id && mess.seen == false)){
                    return {...mess, seen: true};
                }

                return mess;
            }))
        }
    })
  })

  return (
    <div className='flex'>
        <div className='hidden sm:block border-r max-h-screen overflow-y-auto border-gray-200 sm:w-32 md:w-64'>
            <div className='h-[91px] w-full flex justify-center items-center border-b border-gray-100 mb-5'>
                <h2 className='sm:hidden md:block text-center text-2xl'>Conversations</h2>
                <TbMessageChatbot size={50} className='sm:block md:hidden'/>
            </div>
            {allConversation?.map((conversation: SafeConversation, i: any) => 
                <button key={i} onClick={() => {
                            openConversation(conversation.id);
                        }} className={`
                            py-5 
                            flex 
                            sm:justify-center 
                            md:justify-start
                            gap-2 
                            md:pl-2
                            sm:pl-0
                            pl-2
                            w-full
                            cursor-pointer 
                            relative
                            items-center 
                            chat-start
                            sm:flex-col
                            md:flex-row
                            ${pathname == `/conversation/${conversation.id}` && 'bg-gray-100'}
                            `}>
                    <div className="flex avatar">
                        <div className="w-10 h-10 rounded-full">
                            <img alt="Tailwind CSS chat bubble component" src={conversation.user.avatarUrl || '/images/placeholder.jpg'} />
                        </div>
                    </div>
                    <div className='absolute left-10 top-[55px]'>
                        <ActiveDot id={conversation.user.id} isActive={conversation.user.isActive}/>
                    </div>
                    <div className='flex flex-col leading-4 justify-start items-start'>
                        <div className={`sm:hidden md:block
                        ${conversation?.messages?.filter((mes: any) => mes.userId != currentUser.id).slice(-1)[0] && !conversation?.messages?.filter((mes: any) => mes.userId != currentUser.id).slice(-1)[0]?.seen && 'font-bold'}
                        `}>{conversation.user.fullName}</div>
                        <h2 className={`
                        text-sm
                        ${conversation?.messages?.filter((mes: any) => mes.userId != currentUser.id).slice(-1)[0] && !conversation?.messages?.filter((mes: any) => mes.userId != currentUser.id).slice(-1)[0]?.seen && 'font-bold'}
                        `}>
                            {conversation?.messages?.filter((mes: any) => mes.userId != currentUser.id).slice(-1)[0]?.message}
                        </h2>
                    </div>
                </button>
            ).sort((itm: any) => itm.messages?.some((itm: any) => itm.seen == true) ? 1 : -1)}
        </div>
        <div className='flex w-full relative flex-col h-[90vh] sm:shadow-2xl sm:h-screen'>
                <div className='h-[10%] flex justify-between items-center bg-gray-200 border-b border-black'>
                    <div className='flex justify-center sm:ml-5 items-center'>
                    <Link onClick={() => {router.refresh()}} className='block sm:hidden ml-1 mr-5' href={`/conversation`}>
                            <IoIosArrowBack size={25}/>
                    </Link>
                    {users.map((usr: SafeUser, i: any) => (
                            <Link href={`/profile/${usr.id}`} className='flex justify-center items-center' key={i}>
                                <img className='mr-2 bg-black rounded-full overflow-hidden h-[40px] w-[40px]' width={40} height={40} src={usr.avatarUrl || '/images/placeholder.jpg'} alt=''/>
                                <div className='flex mt-2 justify-center flex-col items-start leading-3'>
                                    <h2 className='mb-4'>{usr.fullName}</h2>
                                    <div className='ml-1'>
                                        <ActiveDot id={usr.id} isActive={usr.isActive}/>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className='w-full h-[83%] relative gap-5 px-5 max-h-[83%] overflow-y-auto bg-gray-200'>
                    {messages.map((message: SafeMessages, i: any) => (
                        message?.userId == currentUser?.id ? (
                            <Message images={message.images} seen={message.seen} user={message.user} date={message.updatedAt} myMessage message={message.message} key={i}/>
                        ) : (
                            <Message images={message.images} user={message.user} date={message.updatedAt} message={message.message} key={i}/>
                        )
                    ))}
                    <div className='w-full h-[200px]' ref={messagesEndRef}/>
                </div>
                {image.length != 0 && (
                    <div className='h-[300px] sm:h-[280px] px-5 gap-5 bg-gray-800/90 flex flex-col justify-end overflow-x-auto max-w-full w-full absolute bottom-[9%]'>
                            <button onClick={() => {
                                setImage([])
                            }} className='fixed bg-white right-2 bottom-[425px] sm:bottom-[325px] z-10 rounded-full'>
                                <CiCircleRemove size={35}/>
                            </button>
                            <div className='flex w-full gap-5 max-w-full'>
                                {image.map((url: string, i: any) => (
                                    <div className='w-[200px] mb-5 relative flex-none bg-white h-[200px]' key={i}>
                                        <button onClick={() => {
                                            setImage((prev: any) => prev.filter((thisUrl: string) => thisUrl != url))
                                        }} className='absolute right-2 top-2 bg-white flex justify-center items-center shadow-2xl rounded-full'>
                                            <CiCircleRemove size={30}/>
                                        </button>
                                        <Image src={url} alt='' className='w-full object-cover h-full' width={200} height={200}/>
                                    </div>
                                ))}
                            </div>
                    </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className='w-full border-t border-black h-[10%] bg-gray-200 flex justify-between items-center'>
                        <CldUploadWidget 
                            onUpload={handleUpload} 
                            uploadPreset={uploadPreset}
                            options={{
                                maxFiles: 10
                            }}
                            >
                            {({ open }) => {
                                return (
                                <div
                                    className={`ml-2`}
                                >
                                    <CiImageOn onClick={() => open?.()} size={30}/>
                                </div>
                                ) 
                            }}
                            </CldUploadWidget>
                        <input type='text' {...register('text')}  className='w-full ml-2 rounded-l-2xl h-[50px]' />
                        <input type='submit' disabled={isLoading}  className='mr-5 h-[50px] bg-white px-8 rounded-r-2xl'/>
                </form>
            </div>
    </div>
  )
}
