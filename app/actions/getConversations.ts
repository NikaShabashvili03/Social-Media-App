import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getConversations() {
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
        messages: true
      }
    });

    const allUsers = await prisma.user.findMany({
        where: {
            NOT: {
                id: currentUser?.id
            }
        }
    });
    

    if (!conversations) {
      return null;
    }

    return conversations.map((conversation) => (
        {...conversation,
            user: allUsers.filter((itm: any) => conversation.users.includes(itm.id))[0]
        }
    ))
  } catch (error: any) {
    return null;
  }
}

