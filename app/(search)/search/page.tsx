import React from 'react'
import SearchClient from './SearchClient'
import getAllUser from '@/app/actions/getAllUser'

export default async function page() {
  const allUsers = await getAllUser();
  
  return <SearchClient allUsers={allUsers}/>
}
