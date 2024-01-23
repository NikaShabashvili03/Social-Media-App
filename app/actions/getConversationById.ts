import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUserByIdParams {
    conversationId: string,
}

export default async function getConversationById(
  params: IUserByIdParams
) {
  try {
    const {
      conversationId
    } = params;

    const currentUser = await getCurrentUser();

    if(!conversationId){
        return null
    }

     const convers = await prisma.conversation.findMany({
        where: {
          AND: [
            {id: conversationId},
            {users: {
                has: currentUser?.id
            }}
          ]
        },
        include: {
            messages: {
                include: {
                    user: true
                }
            }
        }
      });


    return convers[0];
  } catch (error: any) {
    // throw new Error(error);
    return undefined
  }
}
