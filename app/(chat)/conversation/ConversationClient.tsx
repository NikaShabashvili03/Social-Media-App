'use client'

import ActiveDot from '@/app/components/ActiveDot';
import { SafeConversation, SafeUser } from '@/app/types';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { PiMessengerLogo } from "react-icons/pi";
import { TbMessageChatbot } from 'react-icons/tb'

interface ConversationClientProps {
  conversations: Array<SafeConversation>
  currentUser: SafeUser
}

export default function ConversationClient({
  conversations,
  currentUser
}: ConversationClientProps) {

  const router = useRouter();
    const openConversation = (conv: string) => {
        router.refresh();
        router.push(`/conversation/${conv}`)
    }

  useEffect(() => {
      router.refresh();
  }, [])

  return (
    <div className='flex'>
      <div className='block w-full max-h-[90vh] border-r overflow-y-auto border-gray-200 sm:w-32 md:w-64'>
            <div className='h-[91px] w-full flex justify-center items-center border-b border-gray-100 mb-5'>
                <h2 className='sm:hidden md:block text-center text-2xl'>Conversations</h2>
                <TbMessageChatbot size={50} className='sm:block md:hidden'/>
            </div>
            {conversations.length != 0 ? (
              conversations.map((conversation: SafeConversation, i: any) => (
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
                                    items-center 
                                    chat-start
                                    sm:flex-col
                                    md:flex-row
                                    relative
                                    overflow-x-hidden
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
                        )
              ).sort((itm: any) => itm.messages?.some((itm: any) => itm.seen === false) ? 1 : -1)) : (
              <h2 className='
              py-5 
              flex 
              justify-center 
              text-center
              gap-2 
              md:pl-2
              sm:pl-0
              pl-2
              w-full
              cursor-pointer 
              items-center 
              chat-start
              '>You dont have friends</h2>
              )
            }
        </div>
        <div className='hidden sm:flex justify-center items-center bg-gray-200 w-full flex-col h-[90vh] sm:shadow-2xl sm:h-screen'>
          <div className='p-5 border-2 border-black rounded-full'>
            <PiMessengerLogo size={50}/>
          </div>
          <div>
            <h2 className='text-xl mt-2'>Your messages</h2>
          </div>
        </div>
    </div>
  )
}
