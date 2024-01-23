'use client'
import ActiveDot from '@/app/components/ActiveDot'
import { SafeUser } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { format } from 'date-fns'
import Search from '@/app/components/Search/Search'

interface SearchClientProps {
    allUsers: Array<SafeUser> | null
}
export default function SearchClient({
    allUsers
}: SearchClientProps) {
  const [filteredData, setFilteredData] = useState<any>(allUsers);

  const handleFilter = (e: any) => {
    const searchWorld = e.target.value;
    const newFilter = allUsers?.filter((value: any) => {
        return value.fullName.toLowerCase().includes(searchWorld.toLowerCase()) || value.email.toLowerCase().includes(searchWorld.toLowerCase())
    })

    setFilteredData(newFilter);

    if(searchWorld === ""){
        setFilteredData(allUsers)
    }
  }

  return (
    <div>
      <div className="px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between pb-6">
            <div>
            <h2 className="font-semibold text-gray-700">User Accounts</h2>
            <span className="text-xs text-gray-500">View all accounts that have registered with us</span>
            </div>
            <div className="flex items-center justify-between">
                <Search handleFilter={handleFilter}/>
            </div>
        </div>
        <div className="overflow-y-hidden rounded-lg border">
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="bg-blue-600 text-left text-xs font-semibold uppercase tracking-widest text-white">
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">Created at</th>
                    <th className="px-5 py-3">Status</th>
                </tr>
                </thead>
                <tbody className="text-gray-500">
                    {filteredData?.map((user: SafeUser, i: any) => (
                        <tr key={i}>
                            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                                <Link href={`/profile/${user.id}`}>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                        <Image width={100} height={100} className="h-full w-full rounded-full" src={user.avatarUrl || '/images/placeholder.jpg'} alt="" />
                                        </div>
                                        <div className="ml-3">
                                        <p className="whitespace-no-wrap">{user.fullName}</p>
                                        </div>
                                    </div>
                                </Link>
                            </td>
                            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">{user.email}</p>
                            </td>
                            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <p className="whitespace-no-wrap">{format(user.createdAt, "LLL d, y")}</p>
                            </td>
        
                            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                            <ActiveDot start isActive={user.isActive} id={user.id}/>
                            </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    </div>
    </div>
  )
}
