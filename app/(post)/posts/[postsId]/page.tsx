import getPostById from '@/app/actions/getPostsById';
import React from 'react'
import PostIdClient from './PostIdClient';
import { redirect } from 'next/navigation';
import getCurrentUser from '@/app/actions/getCurrentUser';

interface IParams {
    postsId: string;
  }
  
export default async function page({ params }: { params: IParams}){
  const postById = await getPostById({postId: params.postsId});
  const currentUser = await getCurrentUser();

  if(!postById){
    redirect('/')
  }

  return <PostIdClient currentUser={currentUser} post={postById}/>
}
