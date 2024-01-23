import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export interface IUsersByFollowersParams {
    followers: Array<string> | undefined,
}

export default async function getUsersByFollowers(
  params: IUsersByFollowersParams
) {
  try {
    const {
      followers
    } = params;

    if(!followers){
        return null
    }

     const user = await prisma.user.findMany({
        where: {
          id: {
            in: followers
          },
        },
      });


    return user;
  } catch (error: any) {
    return undefined
  }
}
