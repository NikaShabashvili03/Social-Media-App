import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export async function POST(
  request: Request,
) {
  const body = await request.json();
  const { 
    userId,
    firstName,
    lastName,
    image,
    email,
   } = body;

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  const fullName = firstName.charAt(0).toUpperCase() + firstName.slice(1) + " " + lastName.charAt(0).toUpperCase() + lastName.slice(1);

  const User = await prisma.user.update({
    where: {
        id: userId
    },
    data: {
      email: email,
      avatarUrl: image,
      firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
      lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      fullName: fullName
    },
  })

  return NextResponse.json(User);
}