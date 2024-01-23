import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getMessagesByConversation() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        users: {
            has: currentUser?.id
        }
      },
      include: {
        messages: {
            where: {
                AND: {
                    seen: false,
                    NOT: {
                        userId: currentUser?.id,
                    },
                }
            }
        }
      }
    });

    

    if (!conversations) {
      return null;
    }
    

    return conversations.flatMap((conversation) => (
        conversation.messages
    ))

  } catch (error: any) {
    return null;
  }
}

