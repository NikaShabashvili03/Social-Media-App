import { getServerSession } from "next-auth/next"
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getAllUser() {
  try {
    const currentUser = await getCurrentUser();

    const allUser = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser?.id
        }
      }
    });

    if (!allUser) {
      return null;
    }

    return allUser
  } catch (error: any) {
    return null;
  }
}

