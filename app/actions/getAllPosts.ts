import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";



export default async function getAllPosts() {
  try {
    const currentUser = await getCurrentUser();

    const allPosts = await prisma.post.findMany({
      // where: {
      //   NOT: {
      //     userId: currentUser?.id
      //   }
      // },
      include: {
        user: true
      }
    });

    if (!allPosts) {
      return null;
    }

    return allPosts;
  } catch (error: any) {
    return null;
  }
}

