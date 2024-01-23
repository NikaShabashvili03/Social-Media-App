import React from 'react'
import ProfileClient from './ProfileClient'
import getCurrentUser from '@/app/actions/getCurrentUser'
import { redirect } from 'next/navigation';
import getUsersByFollowers from '@/app/actions/getUsersByFollowers';
import getUsersByFollowing from '@/app/actions/getUsersByFollowing';

export default async function page() {
  const currentUser = await getCurrentUser();
  const usersByFollowers = await getUsersByFollowers({followers: currentUser?.followers});
  const usersByFollowing = await getUsersByFollowing({following: currentUser?.following});

  if(!currentUser){
    redirect('/login');
  }

  return <ProfileClient usersByFollowing={usersByFollowing} usersByFollowers={usersByFollowers} currentUser={currentUser}/>
}
