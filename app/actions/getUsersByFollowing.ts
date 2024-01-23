import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUsersByFollowingParams {
    following: Array<string> | undefined,
}

export default async function getUsersByFollowing(
  params: IUsersByFollowingParams
) {
  try {
    const {
      following
    } = params;

    if(!following){
        return null
    }

     const user = await prisma.user.findMany({
        where: {
          id: {
            in: following
          },
        },
      });


    return user;
  } catch (error: any) {
    return undefined
  }
}
