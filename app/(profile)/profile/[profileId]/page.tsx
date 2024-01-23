import React from 'react'
import ProfileIdClient from './ProfileIdClient'
import getUserById from '@/app/actions/getUserById';
import { redirect } from 'next/navigation';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getUsersByFollowers from '@/app/actions/getUsersByFollowers';
import getUsersByFollowing from '@/app/actions/getUsersByFollowing';

interface IParams {
    profileId: string;
  }
  
  export default async function page({ params }: { params: IParams}){
  const user = await getUserById({userId: params.profileId});
  const currentUser = await getCurrentUser();

  const usersByFollowers = await getUsersByFollowers({followers: user?.followers});
  const usersByFollowing = await getUsersByFollowing({following: user?.following});

  if(!user){
    redirect('/');
  }

  if(currentUser?.id == user.id){
    redirect('/profile')
  }

  return <ProfileIdClient usersByFollowing={usersByFollowing} usersByFollowers={usersByFollowers} currentUser={currentUser} user={user}/>
}
