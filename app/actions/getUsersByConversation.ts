import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUserByIdParams {
    conversationUsers: Array<string>,
}

export default async function getUsersByConversation(
  params: IUserByIdParams
) {
  try {
    const {
      conversationUsers
    } = params;

    const currentUser = await getCurrentUser();

    if(!currentUser){
        return null;
    }

    if(!conversationUsers){
        return null
    }

     const users = await prisma.user.findMany({
        where: {
            id: {
                in: conversationUsers,
            },
            NOT: {
                id: currentUser?.id
            }
        }
      });


    return users;
  } catch (error: any) {
    return undefined
  }
}
