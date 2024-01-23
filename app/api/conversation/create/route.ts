import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
) {
  const body = await request.json();
  const { 
    userId,
    id
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      return NextResponse.error();
    }
  });

  const cons = await prisma.conversation.findMany({
    where: {
        users: {
            hasEvery: [id, userId],
        }
    }
  })

  if(cons.length > 0){
    return NextResponse.json({
            status: 500,
            id: cons[0]?.id
        }
    )
  }

  
  const conversations = await prisma.conversation.create({
    data: {
      users: [
        userId,
        id
      ]
    },
  })

  return NextResponse.json(conversations);
}