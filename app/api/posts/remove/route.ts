import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
): Promise<any> {
  const body = await request.json();
  const currentUser = await getCurrentUser();

  if(!currentUser){
    return null;
  }

  const { 
    postId,
   } = body;
   

  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      return null;
    }
  });


  const Post = await prisma.post.delete({
    where: {
        id: postId
    },
  })

  return NextResponse.json(Post);
}