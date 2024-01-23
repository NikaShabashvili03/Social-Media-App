import getConversationById from '@/app/actions/getConversationById';
import React from 'react'
import ConversationIdClient from './ConversationIdClient';
import { redirect } from 'next/navigation';
import getCurrentUser from '@/app/actions/getCurrentUser';
import getUsersByConversation from '@/app/actions/getUsersByConversation';
import getConversations from '@/app/actions/getConversations';

interface IParams {
  conversationId: string;
}

export default async function page({ params }: { params: IParams}) {
  const conversationById = await getConversationById({conversationId: params.conversationId});
  const currentUser = await getCurrentUser();
  if(!currentUser) redirect('/login');
  if(!conversationById) redirect('/conversation');
  const conversations = await getConversations();
  
  if(!conversations){
    return redirect('/');
  }

  const users = await getUsersByConversation({conversationUsers: conversationById.users})
  if(!users){
    return redirect('/');
  }
  
  return (<ConversationIdClient allConversation={conversations} users={users} currentUser={currentUser} conversation={conversationById}/>)
}
