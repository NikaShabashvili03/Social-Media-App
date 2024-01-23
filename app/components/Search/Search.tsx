'use client'
import React, { useState } from 'react'
import Link from 'next/link';

import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';

interface SearchProps {
    handleFilter: (e: any) => void
}

export default function Search({
    handleFilter,
}: SearchProps) {
  const [isFocused, setFocused] = useState(false);
  const router = useRouter();
  return (
      <>
        <form className={`w-auto sm:relative flex`}>
            <div className={`
                    bg-gray-100 pl-4 py-3 flex justify-center items-center border-l border-t rounded-l-2xl border-b border-gray-300 
                    `}>
                    {isFocused ? (
                        <div onClick={() => {setFocused(false)}} className='w-3 h-3 flex cursor-pointer justify-center items-center text-gray-500 dark:text-gray-400'>X</div>
                    ) : (
                        <>
                            <IoSearchOutline className="block w-3 h-3 text-gray-500 dark:text-gray-400"/>
                        </>
                    )}
            </div>
            <div className={`
                relative w-[100%] sm:w-full
                `}>
                <input onChange={handleFilter} onFocus={() => {
                    setFocused(true);
                    router.refresh();
                }} type="text" className="block w-full px-2 py-3 text-sm text-gray-900 rounded-r-2xl border-r border-t border-b border-gray-300 rounded-rt-lg bg-gray-100 focus:outline-none" placeholder="Search"/>

            </div>
        </form>
      </>
  )
}
