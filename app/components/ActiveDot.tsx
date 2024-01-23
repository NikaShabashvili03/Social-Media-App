'use client'
import React, { useEffect, useState } from 'react'
import socket from '../libs/socket'



interface ActiveDotProps {
  id: string,
  isActive?: boolean,
  start?: boolean,
}

export default function ActiveDot({isActive, id, start}: ActiveDotProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    socket.on("receive-status", (users) => {
        if(users.some((ven: any) => Object.values(ven).includes(id))){
          setActive(true)
        }
        else{
          setActive(false);
        }
    });
    isActive && setActive(isActive);
  },[isActive])

  return (
    <div className="group/tooltip relative">
        <span className={`
        ${active ? 'bg-success' : 'bg-error'}
        ${start ? 'start-0' : 'end-0'}
        w-[15px] h-[15px] absolute rounded-full bottom-0 -mb-1 -mr-2  border border-white`}></span>
        <span className={`
        ${start ? '-end-5' : 'start-full'}
        text-xs absolute sm:hidden md:block z-10 transition-opacity duration-300 ease-in-out px-3 py-2 whitespace-nowrap text-center transform bg-white rounded-2xl shadow-sm bottom-0 -mb-2 ml-4 font-medium text-secondary-inverse group-hover/tooltip:opacity-100 opacity-0`}> Status: {active ? 'Active' : 'No Active'} </span>
    </div>
  )
}
