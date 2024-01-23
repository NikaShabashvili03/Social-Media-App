import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUserByIdParams {
    userId: string,
}

export default async function getUserById(
  params: IUserByIdParams
) {
  try {
    const {
      userId
    } = params;

    if(!userId){
        return null
    }

     const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          posts: {
            include: {
              user: true
            }
          }
        }
      });


    return user;
  } catch (error: any) {
    return undefined
  }
}
