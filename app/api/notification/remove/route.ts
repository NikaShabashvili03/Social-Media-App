import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
) {
  const body = await request.json();
  const { 
    userId,
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const removeNotifications = await prisma.notification.deleteMany({
    where: {
        userId: userId
    }
  })

  return NextResponse.json(removeNotifications);
}