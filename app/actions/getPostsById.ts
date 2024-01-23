import prisma from "@/app/libs/prismadb";

export interface IUserByIdParams {
    postId: string,
}

export default async function getPostById(
  params: IUserByIdParams
) {
  try {
    const {
        postId
    } = params;

    if(!postId){
        return null
    }

     const post = await prisma.post.findUnique({
        where: {
          id: postId
        },
        include: {
            user: true,
            comments: {
                include: {
                    user: true
                }
            }
        }
      });


    return post;
  } catch (error: any) {
    return undefined
  }
}
