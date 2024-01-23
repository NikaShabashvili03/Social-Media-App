import React from 'react'
import ConversationClient from './ConversationClient'
import getAllUser from '@/app/actions/getAllUser'
import getCurrentUser from '@/app/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import getConversations from '@/app/actions/getConversations';

export default async function page() {
  const currentUser = await getCurrentUser();
  const conversations = await getConversations();

  if(!currentUser){
    redirect('/login');
  }

  if(!conversations){
    return null
  }

  return  <ConversationClient currentUser={currentUser} conversations={conversations}/>
}
